# sh m3u8_to_mp4.sh 로 실행
# 매번 ctrl+c를 눌러주어 mp4 저장을 멈추어야함

for n in $(cat text.txt)
do
    link=$(echo $n | cut -d "-" -f 1)
    fileName=$(echo $n | cut -d "-" -f 2)
    ffmpeg -i $link -bsf:a aac_adtstoasc -vcodec copy -c copy -crf 50 $fileName
done
