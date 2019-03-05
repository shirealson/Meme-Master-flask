#coding:utf-8
#!/usr/bin/python
import sys
import  os 
import mysql.connector
eachItemNum = 10 # 每次加载的图片个数
'''
原来的代码
def  CategoryQuery(category,num):
    conn = mysql.connector.connect(user='root', password='', database='test', use_unicode=True)
    cursor=conn.cursor()
    cursor.execute('SELECT path FROM image WHERE category=%d LIMIT %d,%d;'%(category,num-eachItemNum,num))
    paths = cursor.fetchall()
    cursor.close()
    conn.close()
    return paths
'''
def CategoryQuery(category,num):
    conn = mysql.connector.connect(user='root', password='', database='sougou', use_unicode=True)
    cursor=conn.cursor()
    cursor.execute('SELECT  image_name FROM  emoji   WHERE   template_id=%d LIMIT %d,%d;'%(category,num-eachItemNum,num))
    paths = cursor.fetchall()
    #print  PATHS
    cursor.execute('SELECT  count(image_name) FROM  emoji   WHERE   template_id=%d;'%(category))
    num=cursor.fetchall()[0][0]
    #print num
    cursor.execute('SELECT  template_name FROM  emoji   WHERE   template_id=%d limit 0,1;'%(category))
    name=cursor.fetchall()[0][0]
    #print name
    cursor.close()
    conn.close()
    return (paths,num,name)
def CategoryQuerycn(category):
    conn = mysql.connector.connect(user='root', password='', database='sougou', use_unicode=True)
    cursor=conn.cursor()
    #cursor.execute('SELECT  image_name FROM  emoji   WHERE   template_id=%d;'%(category))
    #paths = cursor.fetchall()
    #PATHS=[]
    #for path  in paths:
    #	PATHS.append(path[0])
    #print  PATHS
    cursor.execute('SELECT  count(image_name) FROM  emoji   WHERE   template_id=%d;'%(category))
    num=cursor.fetchall()[0][0]
    #print num
    cursor.execute('SELECT  template_name FROM  emoji   WHERE   template_id=%d limit 0,1;'%(category))
    name=cursor.fetchall()[0][0]
    #print name
    cursor.close()
    conn.close()
    return (num,name)
def  getMAXTemplateID():
    conn = mysql.connector.connect(user='root', password='', database='sougou', use_unicode=True)
    cursor=conn.cursor()
    cursor.execute('SELECT  max(template_id) FROM  emoji;')
    max = cursor.fetchall()[0][0]
    cursor.close()
    conn.close()
    return max
def  getMINTemplateID():
    conn = mysql.connector.connect(user='root', password='', database='sougou', use_unicode=True)
    cursor=conn.cursor()
    cursor.execute('SELECT  min(template_id) FROM  emoji;')
    max = cursor.fetchall()[0][0]
    cursor.close()
    conn.close()
    return max



