import cv2
import os
import numpy as np

input_dir = "/Users/jin/HP/chill-time/public/images/ゲイマ２"
output_dir = "/Users/jin/HP/chill-time/public/images/processed"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def apply_mosaic(image, x, y, w, h, ratio=0.04):
    ih, iw, _ = image.shape
    x = max(0, x)
    y = max(0, y)
    
    # Expand slightly
    expansion = int(h * 0.1)
    x = max(0, x - int(expansion*0.5))
    y = max(0, y - expansion)
    w = min(iw - x, w + expansion)
    h = min(ih - y, h + expansion*2)
    
    face = image[y:y+h, x:x+w]
    if face.size == 0:
        return image
    
    mw = max(1, int(w * ratio))
    mh = max(1, int(h * ratio))
    
    face_small = cv2.resize(face, (mw, mh), interpolation=cv2.INTER_LINEAR)
    face_mosaic = cv2.resize(face_small, (w, h), interpolation=cv2.INTER_NEAREST)
    
    result = image.copy()
    result[y:y+h, x:x+w] = face_mosaic
    return result

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

images_copied_or_processed = 0

for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filepath = os.path.join(input_dir, filename)
        image = cv2.imread(filepath)
        if image is None:
            continue
            
        print(f"Processing {filename}...")
        processed_image = image.copy()
        
        # we only apply mosaic if we detect a face
        gray = cv2.cvtColor(processed_image, cv2.COLOR_BGR2GRAY)
        faces1 = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        faces2 = profile_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        all_faces = list(faces1) + list(faces2)
        
        for (x, y, w, h) in all_faces:
            processed_image = apply_mosaic(processed_image, x, y, w, h, ratio=0.04)
            
        out_path = os.path.join(output_dir, filename)
        cv2.imwrite(out_path, processed_image)
        images_copied_or_processed += 1

print(f"Finished processing {images_copied_or_processed} images.")
