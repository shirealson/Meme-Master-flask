#coding:utf-8
import jieba
import jieba.analyse
import sys
import  os
from collections import Counter
import mysql.connector











def dbsearch(sentence):
    DBSyName=''
    DBSy = mysql.connector.connect(host="localhost",user='root', password='', database='meme_master', use_unicode=True)#-------------------------------------
    cursorDBSy=DBSy.cursor()
    DBCoreName = 'dataset1'
    DBCore = mysql.connector.connect(host="localhost", user='root', password='', database='meme_master',use_unicode=True)
    cursorDBCore = DBCore.cursor()
    result = []
    #全字段匹配
    cursorDBCore.execute('SELECT  path  FROM  image   WHERE   sentence="%s" ; '%sentence )#---------------------------------------
    resultFullMatch = cursorDBCore.fetchall()
    if len(resultFullMatch):
        for datatemp in resultFullMatch:
            result.append(datatemp)

    #类匹配
    cursorDBCore.execute('SELECT  path  FROM  image   WHERE   template_name LIKE "%%%s%%" ; '%sentence )#---------------------------------------
    resultClassMatch = cursorDBCore.fetchall()
    if len(resultClassMatch):
        for datatemp in resultClassMatch:
            result.append(datatemp)
        return result
        #print(result)
    #分词
    wordJieba = jieba.cut(sentence,cut_all=False)
    print(wordJieba)
    #加入关键词同义词
    for  word  in  wordJieba:
        cursorDBSy.execute('SELECT  sy  FROM  synonyms   WHERE   word="%s" ;'%word)#---------------------------------------------------
        wordSy = cursorDBSy.fetchall()
    #print (wordSy)

    #关键词转换为拼音-----------------------------------




    #数据库查询分词结果
    sortArray=[]
    sortResult=[]
    for  word  in  wordJieba:
        cursorDBCore.execute('SELECT  path  FROM  jiebaresult   WHERE   result="%s" ;'%word)#-------------------------------------------------------
        resultJieba = cursorDBCore.fetchall()
        if  len(resultJieba):
            for datatemp in resultJieba:
                #print(datatemp)
                sortArray.append(datatemp)
    sortResult=Counter(sortArray).most_common(5)
    
    for data in sortResult:
        result.append(data[0])
    #print(result)    
    for  word  in  wordSy:
        cursorDBCore.execute('SELECT  path  FROM  jiebaresult   WHERE   result="%s" ;'%word)#-------------------------------------------------------
        resultSy = cursorDBCore.fetchall()
        if  len(resultSy):
            for datatemp in resultSy:
                result.append(datatemp)

    cursorDBCore.close()
    DBCore.close()
    cursorDBSy.close()
    DBSy.close()
    return result


