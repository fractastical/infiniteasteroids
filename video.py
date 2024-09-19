import os
import json
from datetime import datetime, timedelta, timezone, date
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np
import cv2
from PIL import Image
import csv

# Import functions from the original script
from tree import (
    analyze_project, 
    ensure_utc, 
    calculate_radius, 
    get_commit_data, 
    sanitize_text
)

from datetime import datetime, timedelta, timezone

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
            if isinstance(task['completed'], str):
                task['completed'] = ensure_utc(datetime.fromisoformat(task['completed']))
            elif isinstance(task['completed'], datetime):
                task['completed'] = ensure_utc(task['completed'])
            else:
                raise TypeError(f"Unexpected type for 'completed': {type(task['completed'])}")
    
    # Parse session data
    csv_data = csv.reader(data['daily_session_data'].splitlines())
    next(csv_data)  # Skip header
    session_data = [(ensure_utc(datetime.strptime(row[0], '%Y-%m-%d')), int(row[1]), int(row[2])) 
                    for row in csv_data]
    
    # Add parsed data to the dictionary
    data['ia_tasks'] = ia_tasks
    data['session_data'] = session_data
    
    # Ensure all datetime objects are timezone-aware
    data['js_files'] = [{**file, 'creation_date': ensure_utc(file['creation_date'])} for file in data['js_files']]
    data['commits'] = [ensure_utc(commit['date']) for commit in data['commits']]
    
    return data

def create_frame(data, start_date, end_date, frame_number):
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(16, 9), gridspec_kw={'height_ratios': [3, 1, 1]})
    
    # Plot JS files and connections
    for file in data['js_files']:
        if start_date <= file['creation_date'] <= end_date:
            ax1.scatter(file['creation_date'], file['line_count'], s=file['radius']*10, alpha=0.7)
            ax1.annotate(os.path.basename(file['path']), (file['creation_date'], file['line_count']), fontsize=8)

    # Plot IA tasks
    completed_tasks = [task for task in data['ia_tasks'] if task['completed'] and start_date <= task['completed'] <= end_date]
    if completed_tasks:
        ax1.plot([task['completed'] for task in completed_tasks], 
                 range(len(completed_tasks)), 'r-')
        for i, task in enumerate(completed_tasks):
            ax1.annotate(task['task'][:20], (task['completed'], i), fontsize=8)

    ax1.set_ylabel('JS File Lines / IA Tasks')
    ax1.set_title(f'Project Timeline: {start_date.date()} to {end_date.date()}')

    # Plot commits
    commit_dates = [date for date in data['commits'] if start_date <= date <= end_date]
    ax2.hist(commit_dates, bins=min(20, len(set(commit_dates))), alpha=0.7)
    ax2.set_ylabel('Commits')

    # Plot session data
    session_dates = [date for date, _, _ in data['session_data'] if start_date <= date <= end_date]
    session_counts = [count for date, count, _ in data['session_data'] if start_date <= date <= end_date]
    ax3.bar(session_dates, session_counts, alpha=0.7)
    ax3.set_ylabel('Sessions')

    plt.tight_layout()
    
    # Save the frame
    frame_path = f'frames/frame_{frame_number:04d}.png'
    plt.savefig(frame_path)
    plt.close()

    return frame_path

def main():
    root_dir = os.getcwd()
    data = load_data(root_dir)

    start_date = min(file['creation_date'] for file in data['js_files'])
    end_date = max(file['creation_date'] for file in data['js_files'])

    frame_paths = []
    current_date = start_date
    frame_number = 0

    while current_date <= end_date:
        frame_end_date = current_date + timedelta(days=14)  # Two-week periods
        frame_path = create_frame(data, current_date, frame_end_date, frame_number)
        frame_paths.append(frame_path)
        current_date = frame_end_date
        frame_number += 1

    generate_video(frame_paths, 'project_timeline.mp4')

    # Clean up frame files
    for frame_path in frame_paths:
        os.remove(frame_path)

if __name__ == '__main__':
    main()