import cv2, numpy as np
img = cv2.imread('work/1.jpg')
h,w = img.shape[:2]
mask = np.full((h,w), cv2.GC_BGD, np.uint8)
# probable foreground box around deer (incl. antlers)
mask[30:1125, 210:760] = cv2.GC_PR_BGD
# rough deer silhouette as probable fg
poly = np.array([[300,1125],[230,800],[260,620],[330,560],[420,330],[440,240],[520,300],[600,330],[700,460],[745,500],[720,530],[600,520],[540,560],[640,800],[650,1125]])
cv2.fillPoly(mask,[poly],cv2.GC_PR_FGD)
# sure fg core
core = np.array([[350,1100],[300,800],[380,620],[470,420],[560,420],[520,560],[600,800],[580,1100]])
cv2.fillPoly(mask,[core],cv2.GC_FGD)
# antlers probable fg
antl = np.array([[290,130],[330,40],[360,60],[440,200],[470,150],[455,60],[480,70],[560,200],[610,190],[650,210],[620,280],[560,300],[470,300],[420,250],[300,140]])
cv2.fillPoly(mask,[antl],cv2.GC_PR_FGD)
bg=np.zeros((1,65),np.float64); fg=np.zeros((1,65),np.float64)
cv2.grabCut(img,mask,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
m = np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype(np.uint8)
# keep largest component
n,lab,st,_=cv2.connectedComponentsWithStats(m)
k=1+np.argmax(st[1:,cv2.CC_STAT_AREA]); m=np.where(lab==k,255,0).astype(np.uint8)
cv2.imwrite('work/deer_mask.png',m)
vis=img.copy(); vis[m==0]=(vis[m==0]*0.25).astype(np.uint8)
cv2.imwrite('work/seg_vis.jpg',cv2.resize(vis,(1000,562)))
