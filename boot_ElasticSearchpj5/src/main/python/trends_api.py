# trends_api.py
from flask import Flask, request
from pytrends.request import TrendReq

app = Flask(__name__)

@app.route('/trends', methods=['GET'])
def get_trends():
    keywords = request.args.getlist('keyword')  # 여러 키워드 받기
    if not keywords:
        keywords = ['React', 'Docker', 'Python']  # 기본값
    if len(keywords) > 5:
        return {'error': '최대 5개 키워드만 비교할 수 있습니다.'}, 400
    pytrends = TrendReq(hl='ko', tz=540)
    try:
        pytrends.build_payload(keywords, timeframe='today 5-y', geo='KR')
        data = pytrends.interest_over_time()
        return data.reset_index().to_json(orient='records', force_ascii=False)
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(port=5000)

