import os
import subprocess
from datetime import datetime
import math
import xml.etree.ElementTree as ET

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
    # Adjust radius calculation to have a range from 5 to 25
    return 5 + (math.log10(line_count + 1) / math.log10(10000)) * 20

def analyze_project(root_dir):
    js_files = []
    html_files = []
    image_files = []
    excluded_dirs = {'node_modules', '.git', 'admin'}
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'}
    total_lines = 0
    weapons_count = 22  # Hardcoded as per your information
    game_modes_count = 10  # Hardcoded as per your information
    achievements_count = 45  # Hardcoded as per your information

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
                js_files.append({
                    'path': full_path,
                    'line_count': line_count,
                    'radius': calculate_radius(line_count),
                    'creation_date': creation_date
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
    width, height = 1200, 900  # Increased height to accommodate summary
    margin = {'top': 50, 'right': 50, 'bottom': 150, 'left': 50}  # Increased bottom margin

    # ... [previous SVG generation code remains the same] ...

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
