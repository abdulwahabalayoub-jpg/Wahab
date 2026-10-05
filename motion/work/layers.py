import cv2, numpy as np, os
out='work/layers'; os.makedirs(out,exist_ok=True)
def rgba(rgb,a): return np.dstack([rgb,np.clip(a,0,255).astype(np.uint8)])
img=cv2.imread('work/1.jpg'); notext=cv2.imread('work/plate_notext.png')
m=cv2.imread('work/deer_mask.png',0)
m=cv2.erode(m,np.ones((3,3),np.uint8)); m=cv2.GaussianBlur(m,(0,0),1.2)
cv2.imwrite(f'{out}/deer.png',rgba(img,m))
tm=cv2.imread('work/text_mask.png',0)
cv2.imwrite(f'{out}/text.png',rgba(img,cv2.GaussianBlur(tm,(0,0),0.8)))
cv2.imwrite(f'{out}/forest_lit.jpg',notext,[cv2.IMWRITE_JPEG_QUALITY,95])
cv2.imwrite(f'{out}/forest_empty.jpg',cv2.imread('work/plate_empty.png'),[cv2.IMWRITE_JPEG_QUALITY,95])
# --- frame 2: white construction stroke
i2=cv2.imread('work/2.jpg'); hsv=cv2.cvtColor(i2,cv2.COLOR_BGR2HSV)
sm=((hsv[...,2]>205)&(hsv[...,1]<40)).astype(np.uint8)*255
reg=np.zeros_like(sm); reg[180:960,840:1240]=1; sm*=reg
n,lab,st,_=cv2.connectedComponentsWithStats(sm)
keep=np.zeros_like(sm)
for k in range(1,n):
    if st[k,cv2.CC_STAT_AREA]>300: keep[lab==k]=255
sm=cv2.dilate(cv2.morphologyEx(keep,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8)),np.ones((3,3),np.uint8))
cv2.imwrite(f'{out}/stroke.png',rgba(i2,cv2.GaussianBlur(sm,(0,0),0.8)))
cv2.imwrite(f'{out}/construction_base.jpg',cv2.inpaint(i2,cv2.dilate(sm,np.ones((7,7),np.uint8)),7,cv2.INPAINT_TELEA),[cv2.IMWRITE_JPEG_QUALITY,95])
# --- frame 3: logo pieces on flat colors
i3=cv2.imread('work/3.jpg').astype(np.float32)
def piece(x0,x1,y0,y1,bg,fg,name):
    bg=np.array(bg[::-1],np.float32); fg=np.array(fg[::-1],np.float32)
    a=np.zeros(i3.shape[:2],np.float32)
    d=np.linalg.norm(i3[y0:y1,x0:x1]-bg,axis=2)/np.linalg.norm(fg-bg)
    a[y0:y1,x0:x1]=np.clip((d-0.06)/0.94,0,1)*255
    rgb=np.zeros_like(i3); rgb[:]=fg
    cv2.imwrite(f'{out}/{name}.png',rgba(rgb.astype(np.uint8),a))
L,D,E=(227,227,220),(63,67,53),(227,227,220)
piece(250,760,350,598,L,D,'logo_l_icon'); piece(250,760,598,780,L,D,'logo_l_word')
piece(1250,1760,350,598,D,E,'logo_r_icon'); piece(1250,1760,598,780,D,E,'logo_r_word')
print(open and 'ok')
