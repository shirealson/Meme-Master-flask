#coding:utf-8
#!/usr/bin/python
import sys
import  os 
import mysql.connector
eachItemNum = 10 # 每次加载的图片个数

def  CategoryQuery(category,num):
    conn = mysql.connector.connect(user='root', password='', database='test', use_unicode=True)
    cursor=conn.cursor()
    cursor.execute('SELECT path FROM image WHERE category=%d LIMIT %d,%d;'%(category,num-eachItemNum,num))
    paths = cursor.fetchall()
    cursor.close()
    conn.close()
    return paths
if __name__ == '__main__':
    print (CategoryQuery(1,10))


