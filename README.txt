Weka videos za Ommy hapa, majina yawe haya kamili (au badilisha config.js):

plank-out.mp4
inclined-plank-in.mp4
inclined-plank-jacks.mp4
switch-lunges.mp4
climbers.mp4

Punguza ukubwa kabla ya kuweka (muted, 480p, haraka kupakia):
ffmpeg -i ORIGINAL.mp4 -vf scale=-2:480 -c:v libx264 -crf 28 -an -movflags +faststart plank-out.mp4
