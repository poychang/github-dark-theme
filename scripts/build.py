# NOTE: RUN THIS FILE IN PROJECT DIRECTORY NOT ON ITS OWN
# TODO: Add version updater?
import os
import sass
from pip._internal import main as pip

try: import zipfile
except ImportError:
    pip(['install', '--user', 'zipfile'])
    import zipfile
try: import sass
except ImportError:
    pip(['install', '--user', 'libsass'])
    import sass

if not os.path.exists('Builds'):
    os.makedirs('Builds')

with zipfile.ZipFile('Builds/Github Dark Theme (Firefox + Chrome).zip', 'w') as zf:
    zf.write('dist/manifest.json', 'manifest.json')  # add manifiest.json to archive
    # add icons to archive
    for icon in os.listdir('dist/icons'):
        zf.write(f'dist/icons/{icon}', f'icons/{icon}')
    # convert sass to css
    css = sass.compile(filename='src/app.scss')
    # add css file to archive
    zf.writestr('app/app.css', css)
