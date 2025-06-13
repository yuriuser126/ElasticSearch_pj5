from flask import Flask, request, jsonify
from hanspell import spell_checker

app = Flask(__name__)

@app.route('/correct')
def correct():
    text = request.args.get('text', '')
    try:
        result = spell_checker.check(text)
        return jsonify({'corrected': result.checked})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)