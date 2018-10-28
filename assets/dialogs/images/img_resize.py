import cv2, sys

image = cv2.imread(sys.argv[1], cv2.IMREAD_UNCHANGED)
image_hdpi = cv2.resize(image, None, fx=0.3, fy=0.3);

cv2.imwrite(sys.argv[1], image_hdpi);
