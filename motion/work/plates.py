import cv2, numpy as np
img=cv2.imread('work/1.jpg'); m=cv2.imread('work/deer_mask.png',0)
# text mask: thin bright strokes vs local background
g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY).astype(np.float32)
loc=cv2.medianBlur(g.astype(np.uint8),21).astype(np.float32)
tm=((g-loc)>12).astype(np.uint8)*255
reg=np.zeros_like(tm); reg[420:700,970:1760]=1; reg[40:80,1700:1960]=1
tm=tm*reg; tm=cv2.dilate(tm,np.ones((5,5),np.uint8))
cv2.imwrite('work/text_mask.png',tm)
notext=cv2.inpaint(img,tm,5,cv2.INPAINT_TELEA)
cv2.imwrite('work/plate_notext.png',notext)
# deer-removed plate: inpaint at low res, upscale, blur
dm=cv2.dilate(m,np.ones((71,71),np.uint8))
s=4; sm=cv2.resize(notext,(500,281),interpolation=cv2.INTER_AREA); smm=cv2.resize(dm,(500,281))
fill=cv2.inpaint(sm,(smm>20).astype(np.uint8)*255,15,cv2.INPAINT_TELEA)
fill=cv2.GaussianBlur(cv2.resize(fill,(2000,1125),interpolation=cv2.INTER_CUBIC),(0,0),6)
a=cv2.GaussianBlur(dm,(0,0),10).astype(np.float32)[...,None]/255
empty=(notext*(1-a)+fill*a).astype(np.uint8)
cv2.imwrite('work/plate_empty.png',empty)
cv2.imwrite('work/check.jpg',cv2.resize(np.vstack([notext,empty]),(1000,1125)))
