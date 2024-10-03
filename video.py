import os
import json
from datetime import datetime, timedelta, timezone, date
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np
import cv2
from PIL import Image
import csv
import logging
import traceback
import math


# Import functions from the original script
from tree import (
    analyze_project, 
    ensure_utc, 
    calculate_radius, 
    get_commit_data, 
    sanitize_text
)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def load_data(root_dir):
    # Use the analyze_project function from the original script
    data = analyze_project(root_dir)
    
    # Parse the todo data
    todo_data = json.loads(data['todo_data'])
    
    # Extract IA tasks
    ia_tasks = todo_data['subcategories'].get('ia', [])
    ia_tasks.extend([task for category in todo_data['subcategories'].values() for task in category 
                     if 'ia' in task['task'].lower() or 'asteroids' in task['task'].lower()])
    
    # Ensure completed dates are timezone-aware
    for task in ia_tasks:
        if task['completed']:
            task['completed'] = ensure_utc(task['completed'])
    
    # Parse session data
    csv_data = csv.reader(data['daily_session_data'].splitlines())
    next(csv_data)  # Skip header
    session_data = [(ensure_utc(row[0]), int(row[1]), int(row[2])) 
                    for row in csv_data]
    
    # Add parsed data to the dictionary
    data['ia_tasks'] = ia_tasks
    data['session_data'] = session_data
    
    # Ensure all datetime objects are timezone-aware
    data['js_files'] = [{**file, 'creation_date': ensure_utc(file['creation_date'])} for file in data['js_files']]
    
    # Process commit data
    processed_commits = []
    for commit in data['commits']:
        if isinstance(commit, dict) and 'date' in commit:
            processed_commits.append(ensure_utc(commit['date']))
        else:
            logger.warning(f"Unexpected commit format: {commit}")
    data['commits'] = processed_commits
    
    return data

def create_frame(data, start_date, end_date, frame_number):
    fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(16, 12), gridspec_kw={'height_ratios': [4, 2, 1, 1]})
    
    # Plot JS files and connections
    for file in data['js_files']:
        if start_date <= file['creation_date'] <= end_date:
            ax1.scatter(file['creation_date'], file['line_count'], s=file['radius']*10, alpha=0.7)
            ax1.annotate(os.path.basename(file['path']), (file['creation_date'], file['line_count']), fontsize=8, rotation=45, ha='right')

    # Plot IA tasks with improved spacing
    completed_tasks = [task for task in data['ia_tasks'] if task['completed'] and start_date <= task['completed'] <= end_date]
    if completed_tasks:
        task_dates = [task['completed'] for task in completed_tasks]
        task_positions = range(len(completed_tasks))
        ax1.scatter(task_dates, task_positions, color='red', s=50)
        
        for i, task in enumerate(completed_tasks):
            ax1.annotate(task['task'][:50], (task['completed'], i), fontsize=8, xytext=(5, 0), 
                         textcoords='offset points', va='center', ha='left')
        
        ax1.set_ylim(-1, len(completed_tasks))  # Ensure all tasks are visible

    ax1.set_ylabel('JS File Lines / IA Tasks')
    ax1.set_title(f'Project Timeline: {start_date.date()} to {end_date.date()}')

    # Plot commits
    commit_dates = [date for date in data['commits'] if start_date <= date <= end_date]
    if commit_dates:
        unique_dates = len(set(commit_dates))
        if unique_dates == 1:
            date_counts = {date: commit_dates.count(date) for date in set(commit_dates)}
            dates, counts = zip(*date_counts.items())
            ax2.bar(dates, counts, alpha=0.7)
        else:
            bins = max(1, min(7, unique_dates))
            ax2.hist(commit_dates, bins=bins, alpha=0.7)
        ax2.set_ylabel('Commits')
    else:
        ax2.text(0.5, 0.5, "No commits in this period", ha='center', va='center', transform=ax2.transAxes)
    ax2.set_ylabel('Commits')

    # Plot session data
    session_dates = [date for date, _, _ in data['session_data'] if start_date <= date <= end_date]
    session_counts = [count for date, count, _ in data['session_data'] if start_date <= date <= end_date]
    if session_dates and session_counts:
        ax3.bar(session_dates, session_counts, alpha=0.7)
        ax3.set_ylabel('Sessions')
    else:
        ax3.text(0.5, 0.5, "No session data in this period", ha='center', va='center', transform=ax3.transAxes)
    ax3.set_ylabel('Sessions')

    # Plot images
    try:
        image_files = [file for file in data['image_files'] if start_date <= file['creation_date'] <= end_date]
        if image_files:
            max_images = 100  # Maximum number of images to display
            images_per_row = 20  # Number of images per row
            image_size = 30  # Size of each image in pixels (both width and height)
            
            for i, file in enumerate(image_files[:max_images]):
                try:
                    img = Image.open(file['path'])
                    img.thumbnail((image_size, image_size))
                    
                    # Ensure the image is square
                    img_square = Image.new('RGBA', (image_size, image_size), (255, 255, 255, 0))
                    offset = ((image_size - img.size[0]) // 2, (image_size - img.size[1]) // 2)
                    img_square.paste(img, offset)
                    
                    row = i // images_per_row
                    col = i % images_per_row
                    
                    ax4.imshow(img_square, extent=[col*image_size, (col+1)*image_size, -row*image_size, -(row+1)*image_size], aspect='auto')
                except Exception as e:
                    logger.error(f"Error processing image {file['path']}: {e}")
            
            ax4.set_xlim(0, images_per_row * image_size)
            ax4.set_ylim(-math.ceil(len(image_files[:max_images])/images_per_row) * image_size, 0)
        else:
            ax4.text(0.5, 0.5, "No images in this period", ha='center', va='center', transform=ax4.transAxes)
        
        ax4.set_yticks([])
        ax4.set_xticks([])
        ax4.set_ylabel('Images')
    except Exception as e:
        logger.error(f"Error in image processing section: {str(e)}")
        logger.error(traceback.format_exc())
        ax4.text(0.5, 0.5, "Image processing error", ha='center', va='center', transform=ax4.transAxes)

    plt.tight_layout()
    
    # Create 'frames' directory if it doesn't exist
    os.makedirs('frames', exist_ok=True)
    
    # Save the frame
    frame_path = f'frames/frame_{frame_number:04d}.png'
    plt.savefig(frame_path, dpi=300)  # Increased DPI for better quality
    plt.close()

    return frame_path

def generate_video(frame_paths, output_path, fps=1/3):
    logger.info(f"Starting video generation with {len(frame_paths)} frames")
    try:
        frame = cv2.imread(frame_paths[0])
        height, width, layers = frame.shape
        logger.debug(f"Frame dimensions: {width}x{height}")

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        for i, frame_path in enumerate(frame_paths):
            logger.debug(f"Processing frame {i+1}/{len(frame_paths)}: {frame_path}")
            frame = cv2.imread(frame_path)
            if frame is None:
                logger.error(f"Failed to read frame: {frame_path}")
                continue
            video.write(frame)

        video.release()
        logger.info("Video generation completed")
    except Exception as e:
        logger.error(f"Error during video generation: {str(e)}")
        logger.error(traceback.format_exc())
    finally:
        cv2.destroyAllWindows()


def create_summary_frame(data, start_date, end_date, frame_number):
    fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(16, 12), gridspec_kw={'height_ratios': [4, 2, 1, 1]})
    
    # Plot JS files and connections
    for file in data['js_files']:
        ax1.scatter(file['creation_date'], file['line_count'], s=file['radius']*10, alpha=0.7)
        ax1.annotate(os.path.basename(file['path']), (file['creation_date'], file['line_count']), fontsize=8, rotation=45, ha='right')

    # Plot IA tasks
    completed_tasks = [task for task in data['ia_tasks'] if task['completed']]
    if completed_tasks:
        task_dates = [task['completed'] for task in completed_tasks]
        task_positions = range(len(completed_tasks))
        ax1.scatter(task_dates, task_positions, color='red', s=50)
        
        for i, task in enumerate(completed_tasks):
            ax1.annotate(task['task'][:50], (task['completed'], i), fontsize=8, xytext=(5, 0), 
                         textcoords='offset points', va='center', ha='left')
        
        ax1.set_ylim(-1, len(completed_tasks))

    ax1.set_ylabel('JS File Lines / IA Tasks')
    ax1.set_title(f'Project Summary: {start_date.date()} to {end_date.date()}')

    # Plot commits
    commit_dates = data['commits']
    if commit_dates:
        ax2.hist(commit_dates, bins=20, alpha=0.7)
        ax2.set_ylabel('Commits')
    else:
        ax2.text(0.5, 0.5, "No commits in this period", ha='center', va='center', transform=ax2.transAxes)

    # Plot session data
    session_dates = [date for date, _, _ in data['session_data']]
    session_counts = [count for _, count, _ in data['session_data']]
    if session_dates and session_counts:
        ax3.bar(session_dates, session_counts, alpha=0.7)
        ax3.set_ylabel('Sessions')
    else:
        ax3.text(0.5, 0.5, "No session data in this period", ha='center', va='center', transform=ax3.transAxes)

    # Plot images
    try:
        image_files = data['image_files']
        if image_files:
            max_images = 100
            images_per_row = 20
            image_size = 30
            
            for i, file in enumerate(image_files[:max_images]):
                try:
                    img = Image.open(file['path'])
                    img.thumbnail((image_size, image_size))
                    
                    img_square = Image.new('RGBA', (image_size, image_size), (255, 255, 255, 0))
                    offset = ((image_size - img.size[0]) // 2, (image_size - img.size[1]) // 2)
                    img_square.paste(img, offset)
                    
                    row = i // images_per_row
                    col = i % images_per_row
                    
                    ax4.imshow(img_square, extent=[col*image_size, (col+1)*image_size, -row*image_size, -(row+1)*image_size], aspect='auto')
                except Exception as e:
                    logger.error(f"Error processing image {file['path']}: {e}")
            
            ax4.set_xlim(0, images_per_row * image_size)
            ax4.set_ylim(-math.ceil(len(image_files[:max_images])/images_per_row) * image_size, 0)
        else:
            ax4.text(0.5, 0.5, "No images in this period", ha='center', va='center', transform=ax4.transAxes)
        
        ax4.set_yticks([])
        ax4.set_xticks([])
        ax4.set_ylabel('Images')
    except Exception as e:
        logger.error(f"Error in image processing section: {str(e)}")
        logger.error(traceback.format_exc())
        ax4.text(0.5, 0.5, "Image processing error", ha='center', va='center', transform=ax4.transAxes)

    plt.tight_layout()
    
    os.makedirs('frames', exist_ok=True)
    
    frame_path = f'frames/frame_{frame_number:04d}.png'
    plt.savefig(frame_path, dpi=300)
    plt.close()

    return frame_path

# Replace the existing main() function with this updated version
def main():
    try:
        root_dir = os.getcwd()
        logger.info(f"Analyzing project in directory: {root_dir}")
        data = load_data(root_dir)

        start_date = min(file['creation_date'] for file in data['js_files'])
        end_date = max(file['creation_date'] for file in data['js_files'])
        logger.info(f"Project timeline: {start_date} to {end_date}")

        frame_paths = []
        current_date = start_date
        frame_number = 0

        while current_date <= end_date:
            frame_end_date = current_date + timedelta(days=7)  # Weekly periods
            logger.info(f"Generating frame for period: {current_date} to {frame_end_date}")
            frame_path = create_frame(data, current_date, frame_end_date, frame_number)
            frame_paths.append(frame_path)
            current_date = frame_end_date
            frame_number += 1

        # Add summary frame
        logger.info("Generating summary frame")
        summary_frame_path = create_summary_frame(data, start_date, end_date, frame_number)
        frame_paths.append(summary_frame_path)

        logger.info(f"Generated {len(frame_paths)} frames")

        # Video generation settings
        fps = 1  # 1 frame per second
        regular_frame_duration = 3  # Each regular frame lasts 3 seconds
        summary_frame_duration = 9  # Summary frame lasts 9 seconds

        output_path = 'project_timeline.mp4'
        frame = cv2.imread(frame_paths[0])
        height, width, layers = frame.shape
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        for i, frame_path in enumerate(frame_paths):
            frame = cv2.imread(frame_path)
            if frame is None:
                logger.error(f"Failed to read frame: {frame_path}")
                continue
            
            # Determine how many times to write this frame
            if i == len(frame_paths) - 1:  # Summary frame
                repeat = summary_frame_duration
            else:  # Regular frame
                repeat = regular_frame_duration
            
            # Write the frame multiple times to achieve desired duration
            for _ in range(repeat):
                video.write(frame)
        
        video.release()
        cv2.destroyAllWindows()

        logger.info("Video generation completed")
        logger.info(f"Total video duration: {(len(frame_paths) - 1) * regular_frame_duration + summary_frame_duration} seconds")

        logger.info("Cleaning up frame files")
        for frame_path in frame_paths:
            os.remove(frame_path)
        logger.info("Frame files cleaned up")

    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")
        logger.error(traceback.format_exc())

if __name__ == '__main__':
    main()
