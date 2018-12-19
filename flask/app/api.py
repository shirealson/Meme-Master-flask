#coding:utf-8
from flask import Flask, request
from flask_restful import Resource, Api
import Cdatabase
app = Flask(__name__)
api = Api(app)

data= {}
class getgroup(Resource):
	def get(self,category,num):
		paths=Cdatabase.CategoryQuery(category, num)
		data['category']=category
		data['num']=num
		data['paths']=paths
		return data


api.add_resource(getgroup, '/getgroup/<int:category>/<int:num>',)
if __name__ == '__main__':
    app.run(debug=True,port = 7777,)


#post  getgroup  /<name>/<num>