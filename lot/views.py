from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.shortcuts import redirect
from . import models
from user.models import Profile
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json

def mqcontrol(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            setting_list = models.Settings.objects.all()
            # print(setting_list)
            profile = request.user.profile
            check_tag = profile.r_client.all()
            check_id = [int(x.id) for x in check_tag]
            client_list = models.Clients.objects.filter(id__in=check_id).values()
            # print(client_list)
            client_id = []
            for client in client_list:
                client_id.append(client['id'])
            topic_list = models.Topics.objects.filter(r_client_id__in=client_id).values()

            paginator = Paginator(client_list, 3, 2)  # 每页5条，少于3条合并到上一页
            page = request.GET.get('page')
            try:
                cur_client = paginator.page(page)
            except PageNotAnInteger:
                cur_client = paginator.page(1)
            except EmptyPage:
                cur_client = paginator.page(paginator.num_pages)
            return render(request, 'mqlotcontrol.html',
                          {"cus_list": cur_client, 'setting_list': setting_list,
                           'topic_list': topic_list})
        elif request.method == 'POST':
            pass
        return redirect('mqlotcontrol.html')
    else:
        return redirect('/')

def zqcontrol(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            setting_list = models.Settings.objects.all()
            # print(setting_list)
            profile = request.user.profile
            check_tag = profile.r_client.all()
            check_id = [int(x.id) for x in check_tag]
            client_list = models.Clients.objects.filter(id__in=check_id).values()
            # print(client_list)
            client_id = []
            for client in client_list:
                client_id.append(client['id'])
            topic_list = models.Topics.objects.filter(r_client_id__in=client_id).values()

            paginator = Paginator(client_list, 3, 2)  # 每页5条，少于3条合并到上一页
            page = request.GET.get('page')
            try:
                cur_client = paginator.page(page)
            except PageNotAnInteger:
                cur_client = paginator.page(1)
            except EmptyPage:
                cur_client = paginator.page(paginator.num_pages)
            return render(request, 'zqlotcontrol.html',
                          {"cus_list": cur_client, 'setting_list': setting_list,
                           'topic_list': topic_list})
        elif request.method == 'POST':
            pass
        return redirect('zqlotcontrol.html')
    else:
        return redirect('/')

def commlink(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            setting_list = models.Settings.objects.all()
            # print(setting_list)
            profile = request.user.profile
            check_tag = profile.r_client.all()
            check_id = [int(x.id) for x in check_tag]
            client_list = models.Clients.objects.filter(id__in=check_id).values()
            # print(client_list)
            client_id = []
            for client in client_list:
                client_id.append(client['id'])
            topic_list = models.Topics.objects.filter(r_client_id__in=client_id).values()

            paginator = Paginator(client_list, 3, 2)  # 每页5条，少于3条合并到上一页
            page = request.GET.get('page')
            try:
                cur_client = paginator.page(page)
            except PageNotAnInteger:
                cur_client = paginator.page(1)
            except EmptyPage:
                cur_client = paginator.page(paginator.num_pages)
            return render(request, 'commlink.html',
                          {"cus_list": cur_client, 'setting_list': setting_list,
                           'topic_list': topic_list})
        elif request.method == 'POST':
            pass
        return redirect('commlink.html')
    else:
        return redirect('/')


def logout(request):
    """
    注销
    :param request:
    :return:
    """
    # request.session.flush()
    return redirect('/user/logout')


from decimal import Decimal
import datetime
def default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime.datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, datetime.date):
        return obj.strftime("%Y-%m-%d")

    raise TypeError("Object of type '%s' is not JSON serializable" % type(obj).__name__)


def realmap(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            setting_list = models.Settings.objects.all()
            print(setting_list)
            s1 = 'ws'
            s2 = '127.0.0.1'
            s3 = '8083'
            s4 = '/mqtt'
            for v in setting_list:
                if v.key == 'mqtt_sckeme':
                    s1 = v.value
                if v.key == 'mqtt_host':
                    s2 = v.value
                if v.key == 'mqtt_port':
                    s3 = v.value
                if v.key == 'mqtt_path':
                    s4 = v.value
            url = s1 + '://' + s2 + ':' + s3 + s4
            print(url)

            profile = request.user.profile
            check_tag = profile.r_client.all()
            check_id = [int(x.id) for x in check_tag]
            client_list = models.Clients.objects.filter(id__in=check_id).values()
            return render(request, 'realmap.html', {'client_list':json.dumps(list(client_list), default=default), 'uri':url})
        elif request.method == 'POST':
            pass
        return HttpResponse('maptest')
    else:
        return redirect('/')


def orm(request):
    #Settings添加数据
    # models.Settings.objects.create(title='MQTT协议', key='mqtt_scheme', value='ws')
    # models.Settings.objects.create(title='MQTT地址', key='mqtt_host', value='192.168.31.248')
    # models.Settings.objects.create(title='MQTT端口', key='mqtt_port', value='8083')
    # models.Settings.objects.create(title='MQTT路径', key='mqtt_path', value='/mqtt')
    #
    # models.Settings.objects.create(title='ZMQ协议', key='zmq_scheme', value='http')
    # models.Settings.objects.create(title='ZMQ地址', key='zmq_host', value='192.168.31.238')
    # models.Settings.objects.create(title='ZMQ端口', key='zmq_port', value='8080')
    # models.Settings.objects.create(title='ZMQ路径', key='zmq_path', value='/')

    #Clients添加数据
    # for i in range(1,100):
    #     name = '%s%s' % ('测站', i)
    #     client_key = '%s%s' % ('111111', i)
    #     longitude = '113.51111110'
    #     latitude = '33.51111110'
    #     topic = '%s%s' % ('station/lot/', i)
    #     description = '传感器'
    #     models.Clients.objects.create(name=name, client_key=client_key, longitude=longitude,
    #                                                  latitude=latitude, topic=topic, description=description)

    # models.Topics.objects.create(name='频谱控制', key='freq_control', topic='station/lot/1/freq/rec/para',description='频谱控制',r_client_id=1)
    # models.Topics.objects.create(name='频谱参数', key='freq_para', topic='station/lot/1/freq/para',description='频谱参数',r_client_id=1)
    # models.Topics.objects.create(name='频谱数据', key='freq_data', topic='station/lot/1/freq',description='频谱数据',r_client_id=1)
    #
    # models.Topics.objects.create(name='频谱控制', key='freq_control', topic='station/lot/2/freq/rec/para',description='频谱控制',r_client_id=2)
    # models.Topics.objects.create(name='频谱参数', key='freq_para', topic='station/lot/2/freq/para',description='频谱参数',r_client_id=2)
    # models.Topics.objects.create(name='频谱数据', key='freq_data', topic='station/lot/2/freq',description='频谱数据',r_client_id=2)
    #
    # models.Topics.objects.create(name='频谱控制', key='freq_control', topic='station/lot/3/freq/rec/para',description='频谱控制',r_client_id=3)
    # models.Topics.objects.create(name='频谱参数', key='freq_para', topic='station/lot/3/freq/para',description='频谱参数',r_client_id=3)
    # models.Topics.objects.create(name='频谱数据', key='freq_data', topic='station/lot/3/freq',description='频谱数据',r_client_id=3)
    #
    # models.Topics.objects.create(name='频谱控制', key='freq_control', topic='station/lot/4/freq/rec/para',description='频谱控制',r_client_id=4)
    # models.Topics.objects.create(name='频谱参数', key='freq_para', topic='station/lot/4/freq/para',description='频谱参数',r_client_id=4)
    # models.Topics.objects.create(name='频谱数据', key='freq_data', topic='station/lot/4/freq',description='频谱数据',r_client_id=4)
    #
    # models.Topics.objects.create(name='频谱控制', key='freq_control', topic='station/lot/5/freq/rec/para',description='频谱控制',r_client_id=5)
    # models.Topics.objects.create(name='频谱参数', key='freq_para', topic='station/lot/5/freq/para',description='频谱参数',r_client_id=5)
    # models.Topics.objects.create(name='频谱数据', key='freq_data', topic='station/lot/5/freq',description='频谱数据',r_client_id=5)



    #r_client写入数据，每个用户可以观测的测站关联信息
    # obj = models.Profile.objects.filter(id=1).first()
    # print(obj)
    # obj.r_client.add(1,2,3,4)

    return HttpResponse('orm')