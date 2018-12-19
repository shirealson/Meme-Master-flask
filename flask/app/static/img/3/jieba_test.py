import jieba
import json

userDicFile = 'F:/Python src/userdict.txt'
resultFile = './result.txt'
OCRFile = './OCR.txt'
jsonFile = './dictionary.json'
jieba.load_userdict(userDicFile)
def cutWord(sentence):

    segList = jieba.cut(sentence,cut_all = False)
    return ('/'.join(segList))
#将分词完成的结果写入文件

def writeCutFile(sentence):
    file = open(resultFile,'a+',encoding = 'utf-8')
    file.write(sentence)
    file.close()

def readAndCut():
    data = []
    with open(OCRFile,'r',encoding = 'utf-8') as f:
        data = f.readlines()
    
    index = []
    cut_result = []
    for sentence in data:
        sentence = sentence.replace('\t','')
        new_index,new_content = sentence.split('.',1)
        index.append(new_index)
        cut_result.append(cutWord(new_content))
    
    for i in range(len(cut_result)):
        string = str(index[i]) + ': ' + cut_result[i]
        writeCutFile(string)
        #print(string)
    
       
def CountWordNum():
    with open(resultFile,'r',encoding = 'utf-8') as f:
        data = f.readlines()
    dictionary = {}
    for dataline in data:
        sentence = dataline.split(": ",1)[1]
        #去除空格和换行
        sentence.replace('\n','')
        words = sentence.split("/")
        for word in words:
            if  not word in dictionary:
                dictionary[word] = 1
            else:
                dictionary[word] += 1
    return dictionary

def saveVocalDict():
    dictionary = CountWordNum()
    saveJson(dictionary,jsonFile)
    print(getDictLength(dictionary))
    
    
def saveJson(model,jsonFile):
    with open(jsonFile,'w',encoding='utf-8') as file:
        json.dump(model,file,ensure_ascii=False)
        
    
def getDictLength(dictionary):
    sum = 0
    for key in dictionary:
        sum += 1
    return sum  





if __name__ == "__main__":
    #readAndCut()
    saveVocalDict()


    