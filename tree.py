import os
import subprocess
from datetime import datetime, timedelta, timezone, date
import math
import xml.etree.ElementTree as ET
from PIL import Image
import io
import base64
import re
import json
import csv
from io import StringIO
from collections import defaultdict
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_file_creation_date(file_path):
    try:
        result = subprocess.run(
            ['git', 'log', '--follow', '--format=%aI', '--reverse', '--', file_path],
            capture_output=True, text=True, check=True
        )
        dates = result.stdout.strip().split('\n')
        if dates and dates[0]:  # Check if dates[0] is not empty
            return datetime.fromisoformat(dates[0]).astimezone(timezone.utc)
        return None
    except subprocess.CalledProcessError:
        return None

def ensure_utc(dt):
    if isinstance(dt, str):
        # Try parsing the string as an ISO format datetime
        try:
            dt = datetime.fromisoformat(dt)
        except ValueError:
            # If that fails, try parsing it as a date
            try:
                dt = datetime.strptime(dt, '%Y-%m-%d')
            except ValueError:
                raise ValueError(f"Unable to parse date string: {dt}")
    
    if isinstance(dt, datetime):
        if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    elif isinstance(dt, date):
        return datetime.combine(dt, datetime.min.time()).replace(tzinfo=timezone.utc)
    else:
        raise TypeError(f"Unsupported type for ensure_utc: {type(dt)}")

def calculate_radius(line_count):
    return 5 + (math.log10(line_count + 1) / math.log10(10000)) * 20

def count_variables_in_functions(content):
    functions = re.findall(r'function\s+\w+\s*\([^)]*\)\s*{', content)
    var_counts = [len(re.findall(r'\b(var|let|const)\s+\w+', func)) for func in functions]
    return var_counts

def find_variable_references(content):
    declarations = re.findall(r'\b(var|let|const)\s+(\w+)', content)
    variables = [var for _, var in declarations]
    references = {var: [m.start() for m in re.finditer(r'\b' + var + r'\b', content)] for var in set(variables)}
    return references

def get_commit_data(repo_path):
    command = ['git', '-C', repo_path, 'log', '--pretty=format:%aI']
    result = subprocess.run(command, capture_output=True, text=True)
    commits = result.stdout.strip().split('\n')
    return [{'date': commit} for commit in commits]

def analyze_project(root_dir):
    logger.debug(f"Analyzing project in directory: {root_dir}")
    js_files = []
    html_files = []
    image_files = []
    excluded_dirs = {'node_modules', '.git', 'admin'}
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'}
    total_lines = 0
    weapons_count = 22
    game_modes_count = 10
    achievements_count = 45

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in excluded_dirs]

        for file in files:
            full_path = os.path.join(root, file)
            logger.debug(f"Processing file: {full_path}")
            _, ext = os.path.splitext(file)
            ext = ext.lower()

            creation_date = get_file_creation_date(full_path)
            if creation_date is None:
                creation_date = ensure_utc(datetime.fromtimestamp(os.path.getctime(full_path)))
            else:
                creation_date = ensure_utc(creation_date)

            if ext == '.js':
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    line_count = len(content.splitlines())
                    total_lines += line_count
                    function_var_counts = count_variables_in_functions(content)
                    variable_references = find_variable_references(content)
                js_files.append({
                    'path': full_path,
                    'line_count': line_count,
                    'radius': calculate_radius(line_count),
                    'creation_date': creation_date,
                    'function_var_counts': function_var_counts,
                    'variable_references': variable_references
                })
            elif ext == '.html':
                html_files.append({
                    'path': full_path,
                    'creation_date': creation_date
                })
            elif ext in image_extensions:
                image_files.append({
                    'path': full_path,
                    'creation_date': creation_date
                })

    with open('todo_list.json', 'r') as f:
        todo_data = f.read()

    with open('daily_session_data.csv', 'r') as f:
        daily_session_data = f.read()

    commits = get_commit_data(root_dir)

    return {
        'js_files': js_files, 
        'html_files': html_files, 
        'image_files': image_files,
        'summary': {
            'total_js_files': len(js_files),
            'total_lines': total_lines,
            'total_images': len(image_files),
            'weapons': weapons_count,
            'game_modes': game_modes_count,
            'achievements': achievements_count
        },
        'todo_data': todo_data,
        'daily_session_data': daily_session_data,
        'commits': commits
    }

def sanitize_text(text):
    # Remove control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
    # Replace &, <, >, ", and ' with their XML entity equivalents
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    text = text.replace('"', '&quot;').replace("'", '&apos;')
    return text

def generate_svg(data):
    width, height = 1500, 1800
    margin = {'top': 50, 'right': 50, 'bottom': 300, 'left': 50}

    # Parse the JSON data
    todo_data = json.loads(data['todo_data'])
    
    # Extract IA tasks
    ia_tasks = todo_data['subcategories'].get('ia', [])
    ia_tasks.extend([task for category in todo_data['subcategories'].values() for task in category 
                     if 'ia' in task['task'].lower() or 'asteroids' in task['task'].lower()])
    
    # Filter completed tasks and sort by completion date
    completed_ia_tasks = sorted(
        [task for task in ia_tasks if task['completed']],
        key=lambda x: datetime.fromisoformat(x['completed'])
    )

    # Parse commit data
    commit_data = defaultdict(int)
    for commit in data['commits']:
        date = datetime.fromisoformat(commit['date']).date()
        commit_data[date] += 1

    all_files = data['js_files'] + data['html_files'] + data['image_files']
    if not all_files:
        print("No valid files found with creation dates.")
        return None

    all_files.sort(key=lambda x: x['creation_date'])
    
    time_range = (ensure_utc(all_files[-1]['creation_date']) - 
                ensure_utc(all_files[0]['creation_date'])).total_seconds()
    if time_range == 0:
        time_range = 24 * 60 * 60  # 1 day in seconds

    x_scale = (width - margin['left'] - margin['right']) / time_range
    y_scale_js = (height - margin['top'] - margin['bottom']) * 0.4 / len(data['js_files'])
    y_scale_ia = (height - margin['top'] - margin['bottom']) * 0.2 / (len(completed_ia_tasks) or 1)
    y_scale_image = (height - margin['top'] - margin['bottom']) * 0.2 / (len(data['image_files']) or 1)

    svg = ET.Element('svg', {
        'width': str(width),
        'height': str(height),
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    })

    def calc_x(date):
        if isinstance(date, str):
            date = datetime.fromisoformat(date)
        return margin['left'] + (
            ensure_utc(date) - 
            ensure_utc(all_files[0]['creation_date'])
        ).total_seconds() * x_scale

    # Draw time axis
    start_date = ensure_utc(all_files[0]['creation_date'])
    end_date = ensure_utc(all_files[-1]['creation_date'])
    for i in range(5):
        date = start_date + (end_date - start_date) * (i / 4)
        x = calc_x(date)
        ET.SubElement(svg, 'line', {
            'x1': str(x),
            'y1': str(height - margin['bottom']),
            'x2': str(x),
            'y2': str(height - margin['bottom'] + 10),
            'stroke': 'black',
            'stroke-width': '1'
        })
        text = ET.SubElement(svg, 'text', {
            'x': str(x),
            'y': str(height - margin['bottom'] + 25),
            'font-size': '10',
            'text-anchor': 'middle'
        })
        text.text = sanitize_text(date.strftime('%Y-%m-%d'))

    # Draw JS file circles and variable circles
    for index, file in enumerate(data['js_files']):
        x = calc_x(file['creation_date'])
        y = margin['top'] + index * y_scale_js

        # Main file circle
        ET.SubElement(svg, 'circle', {
            'cx': str(x),
            'cy': str(y),
            'r': str(file['radius']),
            'fill': 'blue',
            'opacity': '0.7'
        })
        
        # Variable count circle
        var_count = sum(file['function_var_counts'])
        var_radius = calculate_radius(var_count)
        ET.SubElement(svg, 'circle', {
            'cx': str(x + 10),
            'cy': str(y - 10),
            'r': str(var_radius),
            'fill': 'lightblue',
            'opacity': '0.7'
        })

        text = ET.SubElement(svg, 'text', {
            'x': str(x),
            'y': str(y + file['radius'] + 15),
            'font-size': '10',
            'text-anchor': 'middle'
        })
        text.text = sanitize_text(os.path.basename(file['path']))

    # Draw lines between related JS files
    for i, file1 in enumerate(data['js_files']):
        x1 = calc_x(file1['creation_date'])
        y1 = margin['top'] + i * y_scale_js
        for j, file2 in enumerate(data['js_files']):
            if i != j:
                x2 = calc_x(file2['creation_date'])
                y2 = margin['top'] + j * y_scale_js
                common_vars = set(file1['variable_references'].keys()) & set(file2['variable_references'].keys())
                if common_vars:
                    ET.SubElement(svg, 'line', {
                        'x1': str(x1 + 10),
                        'y1': str(y1 - 10),
                        'x2': str(x2 + 10),
                        'y2': str(y2 - 10),
                        'stroke': 'rgba(128, 0, 128, 0.3)',
                        'stroke-width': '0.5',
                    })

    # Draw IA task line graph and commit overlay
    ia_graph_start_y = margin['top'] + len(data['js_files']) * y_scale_js + 50
    ia_graph_height = len(completed_ia_tasks) * y_scale_ia
    commit_y_scale = ia_graph_height / (max(commit_data.values()) or 1)

    for index, task in enumerate(completed_ia_tasks):
        x = calc_x(datetime.fromisoformat(task['completed']))
        y = ia_graph_start_y + index * y_scale_ia

        # Draw point
        ET.SubElement(svg, 'circle', {
            'cx': str(x),
            'cy': str(y),
            'r': '3',
            'fill': 'red',
        })

        # Draw line to next point
        if index < len(completed_ia_tasks) - 1:
            next_task = completed_ia_tasks[index + 1]
            next_x = calc_x(datetime.fromisoformat(next_task['completed']))
            next_y = ia_graph_start_y + (index + 1) * y_scale_ia
            ET.SubElement(svg, 'line', {
                'x1': str(x),
                'y1': str(y),
                'x2': str(next_x),
                'y2': str(next_y),
                'stroke': 'red',
                'stroke-width': '1',
            })

        # Add task name
        text = ET.SubElement(svg, 'text', {
            'x': str(x + 5),
            'y': str(y - 5),
            'font-size': '8',
            'transform': f'rotate(-45, {x}, {y})',
        })
        text.text = sanitize_text(task['task'][:20] + ('...' if len(task['task']) > 20 else ''))

    # Draw commit overlay
    for date, count in commit_data.items():
        x = calc_x(datetime.combine(date, datetime.min.time()))
        bar_height = count * commit_y_scale
        ET.SubElement(svg, 'rect', {
            'x': str(x - 1),
            'y': str(ia_graph_start_y + ia_graph_height - bar_height),
            'width': '2',
            'height': str(bar_height),
            'fill': 'rgba(0, 255, 0, 0.5)',  # Semi-transparent green
        })
        
    # Draw Image file thumbnails
    image_size = 13
    image_start_y = ia_graph_start_y + len(completed_ia_tasks) * y_scale_ia + 50
    for index, file in enumerate(data['image_files']):
        x = calc_x(file['creation_date'])
        y = image_start_y + index * y_scale_image

        try:
            with Image.open(file['path']) as img:
                img.thumbnail((image_size, image_size))
                buffered = io.BytesIO()
                img.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode()

                image = ET.SubElement(svg, 'image', {
                    'x': str(x - image_size // 2),
                    'y': str(y - image_size // 2),
                    'width': str(image_size),
                    'height': str(image_size),
                    'xlink:href': f"data:image/png;base64,{img_str}"
                })
        except Exception as e:
            logger.error(f"Error processing image {file['path']}: {e}")
            ET.SubElement(svg, 'rect', {
                'x': str(x - image_size // 2),
                'y': str(y - image_size // 2),
                'width': str(image_size),
                'height': str(image_size),
                'fill': 'red',
                'opacity': '0.7'
            })

    # Parse CSV data for daily sessions
    csv_data = csv.reader(StringIO(data['daily_session_data']))
    next(csv_data)  # Skip header
    session_data = [(datetime.strptime(row[0], '%Y-%m-%d'), int(row[1]), int(row[2])) 
                    for row in csv_data]
    session_data.sort(key=lambda x: x[0])  # Sort by date

    # Calculate scales for session data
    session_height = 200  # Height allocated for session data chart
    session_y_scale = session_height / max(row[1] for row in session_data)  # Scale for number of sessions
    time_y_scale = session_height / max(row[2] for row in session_data)  # Scale for total time

    # Draw session data chart
    chart_start_y = height - margin['bottom'] - session_height
    for date, sessions, time in session_data:
        x = calc_x(date)
        
        # Bar for number of sessions
        session_height = sessions * session_y_scale
        ET.SubElement(svg, 'rect', {
            'x': str(x - 2),
            'y': str(chart_start_y + session_height - session_height),
            'width': '2',
            'height': str(session_height),
            'fill': 'blue',
            'opacity': '0.7'
        })
        
        # Bar for total time
        time_height = (time / 1000000) * time_y_scale  # Convert ms to seconds and scale
        ET.SubElement(svg, 'rect', {
            'x': str(x + 2),
            'y': str(chart_start_y + session_height - time_height),
            'width': '2',
            'height': str(time_height),
            'fill': 'green',
            'opacity': '0.7'
        })

    # Add legend
    legend_y = height - margin['bottom'] + 10
    ET.SubElement(svg, 'rect', {
        'x': str(margin['left']),
        'y': str(legend_y),
        'width': '10',
        'height': '10',
        'fill': 'blue',
        'opacity': '0.7'
    })
    ET.SubElement(svg, 'text', {
        'x': str(margin['left'] + 15),
        'y': str(legend_y + 10),
        'font-size': '12',
    }).text = 'Number of Sessions'

    ET.SubElement(svg, 'rect', {
        'x': str(margin['left'] + 150),
        'y': str(legend_y),
        'width': '10',
        'height': '10',
        'fill': 'green',
        'opacity': '0.7'
    })
    ET.SubElement(svg, 'text', {
        'x': str(margin['left'] + 165),
        'y': str(legend_y + 10),
        'font-size': '12',
    }).text = 'Total Time (seconds)'

    ET.SubElement(svg, 'rect', {
        'x': str(margin['left'] + 300),
        'y': str(legend_y),
        'width': '10',
        'height': '10',
        'fill': 'rgba(0, 255, 0, 0.5)',
    })
    ET.SubElement(svg, 'text', {
        'x': str(margin['left'] + 315),
        'y': str(legend_y + 10),
        'font-size': '12',
    }).text = 'Commits per Day'

    # Add summary section
    summary_y = height - margin['bottom'] + 40
    summary_text = f"""
    Summary: Total JS Files: {data['summary']['total_js_files']}, Total Lines: {data['summary']['total_lines']}, 
    Images: {data['summary']['total_images']}, Weapons: {data['summary']['weapons']}, 
    Game Modes: {data['summary']['game_modes']}, Achievements: {data['summary']['achievements']}
    """
    text = ET.SubElement(svg, 'text', {
        'x': str(margin['left']),
        'y': str(summary_y),
        'font-size': '12',
    })
    text.text = sanitize_text(summary_text.strip())

    return ET.tostring(svg, encoding='unicode')

def main():
    root_dir = os.getcwd()
    data = analyze_project(root_dir)
    svg = generate_svg(data)
    
    if svg:
        with open('project_analysis.svg', 'w', encoding='utf-8') as f:
            f.write(svg)
        print('Analysis complete. SVG file generated: project_analysis.svg')
    else:
        print('No SVG generated due to lack of valid data.')

if __name__ == '__main__':
    main()