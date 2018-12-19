from flask import render_template
from app import app
from app import Cdatabase
from flask import request
from flask import Flask, jsonify

@app.route('/')
@app.route('/index',methods = ['POST','GET'])
def index():
    page_title = '测试页面'
    if request.method == 'GET':
        return render_template('index.html',page_title = page_title)
    elif request.method == 'POST':
        search_content = request.form['search_content']
        return render_template('index.html',page_title = search_content)




@app.route('/getgroup/<int:category>/<int:num>')
def getgroup(category,num):
    data={}
    paths=Cdatabase.CategoryQuery(category,num)
    data['category']=category
    data['num']=num
    data['paths']=paths
    return jsonify(data)

if __name__ == '__main__':
    app.debug = True
    app.run()
