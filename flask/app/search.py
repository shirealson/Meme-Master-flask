#coding:utf-8
import jieba
import jieba.analyse
import sys
import  os
from collections import Counter
import mysql.connector



def dbsearch(sentence):
    #数据库初始化
    DBEmojiName = ''
    DBEmoji = mysql.connector.connect(host="localhost", user='root', password='', database='sougou',use_unicode=True)
    cursorDBEmoji = DBEmoji.cursor()
    DBCoreName = 'dataset1'
    DBCore = mysql.connector.connect(host="localhost", user='root', password='', database='meme_master',use_unicode=True)
    cursorDBCore = DBCore.cursor()

    #存储返回的图片路径
    result = []
    
    #全字段匹配
    cursorDBCore.execute('SELECT  path  FROM  image   WHERE   sentence LIKE "%%%s%%" ; '%sentence )
    resultFullMatch = cursorDBCore.fetchall()
    if len(resultFullMatch):
        for datatemp in resultFullMatch:
            result.append(datatemp)

    #类匹配
    classResult=[]
    resultClassMatch=[]
    cursorDBCore.execute('SELECT  path  FROM  image   WHERE   template_name LIKE "%%%s%%" ; '%sentence )
    resultClassMatch = cursorDBCore.fetchall()
    if len(resultClassMatch):
        for datatemp in resultClassMatch:
            classResult.append(datatemp)
            
    resultClassMatch=[]
    
    cursorDBEmoji.execute('SELECT  image_name  FROM  emoji   WHERE   template_name LIKE "%%%s%%" ; '%sentence )
    resultClassMatch = cursorDBEmoji.fetchall()
    if len(resultClassMatch):
        for datatemp in resultClassMatch:
            classResult.append(datatemp)
    
    
    #分词
    wordJieba = jieba.cut(sentence,cut_all=False)
    
    #加入关键词同义词
    wordSy=[]
    for  word_1  in  wordJieba:
        cursorDBCore.execute('SELECT  sy  FROM  synonyms   WHERE   word="%s" ;'%word_1)
        wordSyTemp=cursorDBCore.fetchall()
        if len(wordSyTemp):
            for datatemp in wordSyTemp:
                wordSy.append(datatemp)
            wordSyTemp=[]
            
    #关键词转换为拼音-----------------------------------
        


    #数据库查询分词结果
    sortTemp=[]
    sortResult=[]
    
    for  word_2  in  wordJieba:
        cursorDBCore.execute('SELECT  path  FROM  jiebaresult   WHERE   result="%s" ;'%word_2)
        resultJieba = cursorDBCore.fetchall()
        if  len(resultJieba):
            for datatemp in resultJieba:
                sortTemp.append(datatemp)
            resultJieba=[]

    sortResult=Counter(sortTemp).most_common(100)
    for data in sortResult:
        result.append(data[0])

    sortTemp=[]
    
    for  word_3  in  wordSy:
        cursorDBCore.execute('SELECT  path  FROM  jiebaresult   WHERE   result="%s" ;'%word_3)
        resultSy = cursorDBCore.fetchall()
        if  len(resultSy):
            for datatemp in resultSy:
                sortTemp.append(datatemp)
            resultSy=[]
            
    sortResult=Counter(sortTemp).most_common(100)
    for data in sortResult:
        result.append(data[0])


    for datatemp in classResult:
        result.append(datatemp)

    cursorDBEmoji.close()
    DBEmoji.close()
    cursorDBCore.close()
    DBCore.close()
    
    return result

