from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


import uuid, json ,os,time
# Create your views here.



def index(request):
	# return HttpResponse('videos')
	return render(request, 'videos/index.html')

def videoGen(category):
	path = 'data/videos/'+category+'/';
	baseUrl='http://127.0.0.1:8000/media/'
	fileList = os.listdir(path)
	fileList = [os.path.join(path,i) for i in fileList]
	videoUrls = sorted(fileList,reverse=True)
	videoUrls = [baseUrl + s for s in videoUrls]
	videoUrls = [s[:27] + s[32:] for s in videoUrls]
	videoUrls = [category]+videoUrls
	return videoUrls

def upload(request):
	print(request)
	if(request.method == 'POST'):
		file = request.FILES['video']
		fileName = str(int(time.time()))+'.mp4'
		filePath = 'data/temp/' 
		with open(filePath + fileName, 'wb+') as destination:
			for chunk in file.chunks():
				destination.write(chunk)
		category = classify()
		os.rename('./data/temp/'+fileName,'./data/videos/'+category+'/'+fileName)
		if(category == 'none'):
			os.remove('./data/temp/'+fileName)
			return HttpResponse(json.dumps(['none']),content_type='application/json')
		return HttpResponse(json.dumps(category),content_type='application/json')
	else:
		category=request.GET.get('category','')
	if(request.GET.get('category') != 'all'):
		videoUrls=videoGen(category)
		print(videoUrls)
		return HttpResponse(json.dumps(videoUrls), content_type='application/json')
	else:
		arr=['sports','dance','cookery']
		videoUrls=[]
		for i in arr:
			videoUrls+=videoGen(i)[1:]
		print(videoUrls,'...')
		videoUrls.reverse()
		print(videoUrls,'.,.,.,.,')
		return HttpResponse(json.dumps(videoUrls), content_type='application/json')


# classify
def classify():
	return 'sports' 
