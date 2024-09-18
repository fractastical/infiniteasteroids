import os
import subprocess
from datetime import datetime
import math
import xml.etree.ElementTree as ET
import re
import ast

def get_file_creation_date(file_path):
    try:
        result = subprocess.run(
            ['git', 'log', '--follow', '--format=%aI', '--reverse', '--', file_path],
            capture_output=True, text=True, check=True
        )
        dates = result.stdout.strip().split('\n')
        return dates[0] if dates else None
    except subprocess.CalledProcessError:
        return None

def calculate_radius(line_count):
    return 5 + (math.log10(line_count + 1) / math.log10(10000)) * 20

def count_variables_in_functions(content):
    tree = ast.parse(content)
    function_var_counts = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            variables = set()
            for child in ast.walk(node):
                if isinstance(child, ast.Name) and isinstance(child.ctx, ast.Store):
                    variables.add(child.id)
            function_var_counts.append(len(variables))
    return function_var_counts

def find_variable_references(content):
    tree = ast.parse(content)
    references = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            if node.id not in references:
                references[node.id] = set()
            references[node.id].add(node.lineno)
    return references

def analyze_project(root_dir):
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
            _, ext = os.path.splitext(file)
            ext = ext.lower()

            creation_date = get_file_creation_date(full_path) or datetime.fromtimestamp(os.path.getctime(full_path)).isoformat()

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
        }
    }

def generate_svg(data):
    width, height = 1500, 1000  # Increased dimensions to accommodate more details
    margin = {'top': 50, 'right': 50, 'bottom': 150, 'left': 50}

    all_files = data['js_files'] + data['html_files'] + data['image_files']
    if not all_files:
        print("No valid files found with creation dates.")
        return None

    all_files.sort(key=lambda x: x['creation_date'])
    
    time_range = (
        (datetime.fromisoformat(all_files[-1]['creation_date']) - 
         datetime.fromisoformat(all_files[0]['creation_date'])).total_seconds()
        if len(all_files) > 1 else 24 * 60 * 60  # 1 day in seconds
    )

    x_scale = (width - margin['left'] - margin['right']) / time_range
    y_scale = (height - margin['top'] - margin['bottom']) / (len(all_files) + 1)

    svg = ET.Element('svg', {
        'width': str(width),
        'height': str(height),
        'xmlns': 'http://www.w3.org/2000/svg'
    })

    def calc_x(date):
        return margin['left'] + (
            datetime.fromisoformat(date) - 
            datetime.fromisoformat(all_files[0]['creation_date'])
        ).total_seconds() * x_scale

    # Draw time axis
    start_date = datetime.fromisoformat(all_files[0]['creation_date'])
    end_date = datetime.fromisoformat(all_files[-1]['creation_date'])
    for i in range(5):
        date = start_date + (end_date - start_date) * (i / 4)
        x = calc_x(date.isoformat())
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
        text.text = date.strftime('%Y-%m-%d')

    # Find index.html
    index_html = next((f for f in data['html_files'] if os.path.basename(f['path']) == 'index.html'), None)
    index_x = calc_x(index_html['creation_date']) if index_html else margin['left']
    index_y = height / 2

    # Draw JS file circles and variable circles
    for index, file in enumerate(data['js_files']):
        x = calc_x(file['creation_date'])
        y = margin['top'] + (index + 1) * y_scale

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
        text.text = os.path.basename(file['path'])

        # Draw line to index.html
        if index_html:
            ET.SubElement(svg, 'line', {
                'x1': str(x),
                'y1': str(y),
                'x2': str(index_x),
                'y2': str(index_y),
                'stroke': 'gray',
                'stroke-width': '1'
            })

    # Draw variable reference lines
    for i, file1 in enumerate(data['js_files']):
        x1 = calc_x(file1['creation_date'])
        y1 = margin['top'] + (i + 1) * y_scale
        for j, file2 in enumerate(data['js_files']):
            if i != j:
                x2 = calc_x(file2['creation_date'])
                y2 = margin['top'] + (j + 1) * y_scale
                common_vars = set(file1['variable_references'].keys()) & set(file2['variable_references'].keys())
                if common_vars:
                    ET.SubElement(svg, 'line', {
                        'x1': str(x1 + 10),
                        'y1': str(y1 - 10),
                        'x2': str(x2 + 10),
                        'y2': str(y2 - 10),
                        'stroke': 'purple',
                        'stroke-width': '0.5',
                        'opacity': '0.3'
                    })

    # Draw Image file dots
    for index, file in enumerate(data['image_files']):
        x = calc_x(file['creation_date'])
        y = margin['top'] + (len(data['js_files']) + index + 1) * y_scale

        ET.SubElement(svg, 'circle', {
            'cx': str(x),
            'cy': str(y),
            'r': '3',
            'fill': 'red',
            'opacity': '0.7'
        })
        
        text = ET.SubElement(svg, 'text', {
            'x': str(x),
            'y': str(y + 15),
            'font-size': '10',
            'text-anchor': 'middle'
        })
        text.text = os.path.basename(file['path'])

    # Draw HTML file representations
    for index, html_file in enumerate(data['html_files']):
        x = calc_x(html_file['creation_date'])
        y = height - margin['bottom'] - 50 if html_file != index_html else index_y
        
        ET.SubElement(svg, 'rect', {
            'x': str(x - 25),
            'y': str(y - 15),
            'width': '50',
            'height': '30',
            'fill': 'green',
            'opacity': '0.7'
        })
        text = ET.SubElement(svg, 'text', {
            'x': str(x),
            'y': str(y + 30),
            'font-size': '10',
            'text-anchor': 'middle'
        })
        text.text = os.path.basename(html_file['path'])

    # Add summary section
    summary_y = height - margin['bottom'] + 60
    summary_text = f"""
    Summary:
    Total JS Files: {data['summary']['total_js_files']}
    Total Lines of Code: {data['summary']['total_lines']}
    Total Images: {data['summary']['total_images']}
    Weapons: {data['summary']['weapons']}
    Game Modes: {data['summary']['game_modes']}
    Achievements: {data['summary']['achievements']}
    """
    for i, line in enumerate(summary_text.strip().split('\n')):
        text = ET.SubElement(svg, 'text', {
            'x': str(margin['left']),
            'y': str(summary_y + i * 20),
            'font-size': '14',
            'font-weight': 'bold' if i == 0 else 'normal'
        })
        text.text = line.strip()

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