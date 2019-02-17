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
zf_firefox = zipfile.ZipFile('Builds/Github Dark Theme (Firefox).zip', 'w')
zf_chrome = zipfile.ZipFile('Builds/Github Dark Theme (Chrome).zip', 'w')

# add manifiest.json to archive
zf_firefox.write('dist/manifest.json', 'manifest.json')
zf_chrome.write('dist/manifest.json', 'manifest.json')

# add icons to archive
for icon in os.listdir('dist/icons'):
        zf_firefox.write(f'dist/icons/{icon}', f'icons/{icon}')
        zf_chrome.write(f'dist/icons/{icon}', f'icons/{icon}')

# convert sass to css
css = sass.compile(filename='src/app.scss')

# add css file to archive
zf_firefox.writestr('app/app.css', css)
zf_chrome.writestr('app/app.css', css)

zf_firefox.close()
zf_chrome.close()
