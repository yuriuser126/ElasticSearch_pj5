from flask import Flask, request, jsonify
from pytrends.request import TrendReq

app = Flask(__name__)

@app.route('/trends', methods=['GET'])
def get_trends():
    keywords = request.args.getlist('keyword')
    if not keywords:
        keywords = ['React', 'Docker', 'Python', 'Java', 'Spring']
    if len(keywords) > 5:
        return jsonify({'error': '최대 5개 키워드만 비교할 수 있습니다.'}), 400
    pytrends = TrendReq(hl='ko', tz=540)
    try:
        pytrends.build_payload(keywords, timeframe='today 5-y', geo='KR')
        data = pytrends.interest_over_time()
        return jsonify(data.reset_index().to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
