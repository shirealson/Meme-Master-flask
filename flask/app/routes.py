from flask import render_template
from app import app
from app import Cdatabase
from flask import request
from app.search import dbsearch
from flask import Flask, jsonify
import random
@app.route('/')
@app.route('/index',methods = ['POST','GET'])
def index():
    page_title = '测试页面'
    if request.method == 'GET':
        return render_template('index.html',page_title = page_title)
    elif request.method == 'POST':
        search_content = request.form['search_content']
        return render_template('index.html',page_title = search_content)



'''
旧代码
@app.route('/getgroup/<int:category>/<int:num>')
def getgroup(category,num):
    data={}
    paths=Cdatabase.CategoryQuery(category,num)
    data['category']=category
    data['num']=num
    data['paths']=paths
    return jsonify(data)
'''
@app.route('/getgroup/<int:category>/<int:num>')
def getgroup(category,num):
    data={}
    paths,full_num,name=Cdatabase.CategoryQuery(category,num)
    data['category']=category
    data['num']=full_num
    data['paths']=paths
    data['category_cn_name']=name
    return jsonify(data)
@app.route('/getrandom')
def getrandom():
    datas={}
    max=Cdatabase.getMAXTemplateID()
    min=Cdatabase.getMINTemplateID()
    for   i  in range(1,11):
        data={}
        category=random.randint(min, max)
        num,name=Cdatabase.CategoryQuerycn(category)
        data['category']=category
        data['num']=num
        data['category_cn_name']=name
        datas[str(i)]=data
    return jsonify(datas)
@app.route('/search/<keyword>/<int:number>')
def search(keyword,number):
    data={}
    data['paths']=dbsearch(keyword)
    data['search_result_num']=len(data['paths'])
    if data['search_result_num'] >= number :
        data['paths']=data['paths'][number-10:number]
        return jsonify(data)
    else:
        data['paths']=data['paths'][(number-10):data['search_result_num']]
        return jsonify(data)

if __name__ == '__main__':
    app.debug = True
    app.run()
