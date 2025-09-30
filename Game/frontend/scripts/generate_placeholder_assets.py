#!/usr/bin/env python3
"""
Generate placeholder assets for Golden Fortune Slots
This creates simple SVG-based symbol images for development
"""

import os
from pathlib import Path

# Define colors for each symbol
SYMBOL_COLORS = {
    'wild': '#FFD700',      # Gold
    'gold': '#DAA520',      # Goldenrod
    'gem': '#4169E1',       # Royal Blue
    'coin': '#FF8C00',      # Dark Orange
    'ring': '#9370DB',      # Medium Purple
    'ace': '#DC143C',       # Crimson
    'king': '#4682B4',      # Steel Blue
    'queen': '#FF69B4',     # Hot Pink
    'jack': '#32CD32',      # Lime Green
    'ten': '#FF4500',       # Orange Red
    'scatter': '#FFD700',   # Gold
}

SYMBOL_LABELS = {
    'wild': 'W',
    'gold': '💰',
    'gem': '💎',
    'coin': '🪙',
    'ring': '💍',
    'ace': 'A',
    'king': 'K',
    'queen': 'Q',
    'jack': 'J',
    'ten': '10',
    'scatter': '⭐',
}

def create_symbol_svg(name, color, label, variant='normal'):
    """Create an SVG symbol"""

    opacity = '1.0'
    glow = ''
    blur = ''

    if variant == 'win':
        glow = f'''
        <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        '''
        opacity = '1.0'
    elif variant == 'blur':
        blur = 'filter="url(#motion-blur)"'
        opacity = '0.6'

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad{name}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:{color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:{darken_color(color)};stop-opacity:1" />
        </linearGradient>
        {glow}
        <filter id="motion-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0,5" />
        </filter>
    </defs>

    <!-- Background circle -->
    <circle cx="150" cy="150" r="130" fill="url(#grad{name})" opacity="{opacity}" {blur}/>

    <!-- Inner circle -->
    <circle cx="150" cy="150" r="110" fill="none" stroke="white" stroke-width="4" opacity="0.3"/>

    <!-- Symbol text -->
    <text x="150" y="150" font-family="Arial, sans-serif" font-size="80" font-weight="bold"
          fill="white" text-anchor="middle" dominant-baseline="central"
          style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
        {label}
    </text>

    {f'<circle cx="150" cy="150" r="140" fill="none" stroke="{color}" stroke-width="6" opacity="0.8" filter="url(#glow)"/>' if variant == 'win' else ''}
</svg>'''

    return svg

def darken_color(hex_color):
    """Darken a hex color by 20%"""
    hex_color = hex_color.lstrip('#')
    r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    r = int(r * 0.7)
    g = int(g * 0.7)
    b = int(b * 0.7)
    return f'#{r:02x}{g:02x}{b:02x}'

def create_ui_element_svg(name, width, height, color):
    """Create simple UI element SVG"""

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:{color};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:{darken_color(color)};stop-opacity:0.8" />
        </linearGradient>
    </defs>
    <rect width="{width}" height="{height}" rx="10" fill="url(#grad)"/>
    <rect x="5" y="5" width="{width-10}" height="{height-10}" rx="8"
          fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
</svg>'''

    return svg

def create_background_svg(width, height):
    """Create background gradient SVG"""

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <radialGradient id="bg-grad">
            <stop offset="0%" style="stop-color:#2a2a4e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
        </radialGradient>
    </defs>
    <rect width="{width}" height="{height}" fill="url(#bg-grad)"/>
</svg>'''

    return svg

def create_particle_svg(size, color):
    """Create particle SVG"""

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <radialGradient id="particle-grad">
            <stop offset="0%" style="stop-color:{color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:{color};stop-opacity:0" />
        </radialGradient>
    </defs>
    <circle cx="{size//2}" cy="{size//2}" r="{size//2}" fill="url(#particle-grad)"/>
</svg>'''

    return svg

def main():
    # Get the static directory
    script_dir = Path(__file__).parent
    static_dir = script_dir.parent / 'static'

    print("Generating placeholder assets...")

    # Create symbol images
    symbols_dir = static_dir / 'images' / 'symbols'
    symbols_dir.mkdir(parents=True, exist_ok=True)

    for name, color in SYMBOL_COLORS.items():
        label = SYMBOL_LABELS[name]

        # Normal version
        svg = create_symbol_svg(name, color, label, 'normal')
        (symbols_dir / f'{name}.svg').write_text(svg)

        # Win version
        svg = create_symbol_svg(name, color, label, 'win')
        (symbols_dir / f'{name}_win.svg').write_text(svg)

        # Blur version
        svg = create_symbol_svg(name, color, label, 'blur')
        (symbols_dir / f'{name}_blur.svg').write_text(svg)

        print(f"  Created {name} symbols")

    # Create UI elements
    ui_dir = static_dir / 'images' / 'ui'
    ui_dir.mkdir(parents=True, exist_ok=True)

    ui_elements = [
        ('btn_spin', 200, 200, '#FFD700'),
        ('btn_spin_hover', 200, 200, '#FFED4E'),
        ('btn_spin_pressed', 200, 200, '#DAA520'),
        ('btn_spin_disabled', 200, 200, '#808080'),
        ('panel_balance', 300, 100, '#1a1a2e'),
        ('panel_bet', 300, 100, '#1a1a2e'),
        ('panel_win', 300, 100, '#1a1a2e'),
        ('logo', 400, 100, '#FFD700'),
    ]

    for name, width, height, color in ui_elements:
        svg = create_ui_element_svg(name, width, height, color)
        (ui_dir / f'{name}.svg').write_text(svg)

    print("  Created UI elements")

    # Create backgrounds
    bg_dir = static_dir / 'images' / 'backgrounds'
    bg_dir.mkdir(parents=True, exist_ok=True)

    backgrounds = [
        ('main', 1920, 1080),
        ('freespin', 1920, 1080),
        ('reel_frame', 1400, 600),
        ('reel_bg', 1200, 500),
    ]

    for name, width, height in backgrounds:
        svg = create_background_svg(width, height)
        (bg_dir / f'{name}.svg').write_text(svg)

    print("  Created backgrounds")

    # Create particles
    particle_dir = static_dir / 'images' / 'particles'
    particle_dir.mkdir(parents=True, exist_ok=True)

    particles = [
        ('coin', 64, '#FFD700'),
        ('sparkle', 32, '#FFFFFF'),
        ('star', 48, '#FFED4E'),
        ('glow', 128, '#FFD700'),
    ]

    for name, size, color in particles:
        svg = create_particle_svg(size, color)
        (particle_dir / f'{name}.svg').write_text(svg)

    print("  Created particles")

    # Create empty sound directories
    (static_dir / 'sounds' / 'music').mkdir(parents=True, exist_ok=True)
    (static_dir / 'sounds' / 'sfx').mkdir(parents=True, exist_ok=True)

    # Create placeholder audio note
    readme = '''# Audio Assets

Audio assets are not included in this repository.
You need to provide your own audio files:

## Music:
- main_theme.mp3 - Main game background music
- freespin_theme.mp3 - Free spin mode music
- bigwin_celebration.mp3 - Big win celebration music

## Sound Effects:
- spin.mp3 - Reel spin sound
- stop.mp3 - Reel stop sound
- button_click.mp3 - UI button click
- win_small.mp3 - Small win sound
- win_medium.mp3 - Medium win sound
- win_big.mp3 - Big win sound
- win_max.mp3 - Max win celebration
- scatter_land.mp3 - Scatter symbol landing
- anticipation.mp3 - Anticipation/near miss sound
- freespin_trigger.mp3 - Free spin trigger fanfare
- coin_drop.mp3 - Coin drop sound
- wild_substitute.mp3 - Wild symbol substitution

You can find royalty-free casino sound effects at:
- https://freesound.org/
- https://www.zapsplat.com/
- https://www.soundjay.com/
'''

    (static_dir / 'sounds' / 'README.md').write_text(readme)

    print("\n✅ Placeholder assets generated successfully!")
    print(f"Assets location: {static_dir}")
    print("\nNote: These are placeholder SVG assets for development.")
    print("Replace with professional graphics for production.")

if __name__ == '__main__':
    main()
