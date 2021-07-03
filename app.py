"""
	HW6 CSCI571 Due Mar 8 @ 11:59PM/2359
	Andrew M. Calhoun
	USC ID: 4458531648
	email: amcalhou@usc.edu
"""

from flask import Flask
from flask_cors import CORS

app = Flask(__name__, static_url_path='/static/')
CORS(app)
import requests


@app.route('/')
def home():
    print('Let\'s get a webpage')
    #return '<a href="/static/index.html">Go here if you landed on the home.</a>'
    return app.send_static_file('index.html')

# Trending Movie Endpoint
@app.route('/trending/movie')
def get_trending_all():
    print('Let\'s see whats trending!')
    d = requests.get(
        'https://api.themoviedb.org/3/trending/movie/week?api_key=a21eabff9a50895a28e14f57af081a11').content
    print(d)
    return d


# AIRING TODAY ENDPOINT
@app.route('/tv/airing')
def get_tv_airing_today():
    d = requests.get('https://api.themoviedb.org/3/tv/airing_today?api_key=a21eabff9a50895a28e14f57af081a11').content
    print(d)
    return d


# Search for a movie by name via query
@app.route('/movie/<name>')
def get_movie_by_name(name):
    d = requests.get(
        f'https://api.themoviedb.org/3/search/movie?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US&query={name}&page=include_adult=false').content
    print(d)
    return d


# Search for a TV show by name via query
@app.route('/tv/<name>')
def get_tv_by_name(name):
    d = requests.get(
        f'https://api.themoviedb.org/3/search/tv?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US&query={name}&page=include_adult=false').content
    print(d)
    return d


# Multi-Search
@app.route('/multi/<name>')
def get_multisearch_by_name(name):
    d = requests.get(
        f'https://api.themoviedb.org/3/search/multi?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US&query={name}&page=include_adult=false').content
    print(d)
    return d


# Movie Details, Credits, and Reviews
@app.route('/movie/details/<id>')
def get_movie_by_id(id=500):
    d = requests.get(
        f'https://api.themoviedb.org/3/movie/{id}?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


@app.route('/movie/credits/<id>')
def get_movie_credits_by_id(id=500):
    d = requests.get(
        f'https://api.themoviedb.org/3/movie/{id}/credits?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


@app.route('/movie/reviews/<id>')
def get_movie_reviews_by_id(id=500):
    d = requests.get(
        f'https://api.themoviedb.org/3/movie/{id}/reviews?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US&page=1').content
    print(d)
    return d


# TV Details, Credits and Reviews

@app.route('/tv/details/<id>')
def get_tv_by_id(id=500):
    d = requests.get(
        f'https://api.themoviedb.org/3/tv/{id}?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


@app.route('/tv/credits/<id>')
def get_tv_credits_by_id(id=500):
    d = requests.get(
        f'https://api.themoviedb.org/3/tv/{id}/credits?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


@app.route('/tv/reviews/<id>')
def get_tv_reviews_by_id(id=500):
    d = requests.get(
        f'https://api.themoviedb.org/3/tv/{id}/reviews?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US&page=1').content
    print(d)
    return d


@app.route('/movie/genre')
def get_movie_genres():
    d = requests.get(
        f'https://api.themoviedb.org/3/genre/movie/list?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


@app.route('/tv/genre')
def get_tv_genres():
    d = requests.get(
        f'https://api.themoviedb.org/3/genre/tv/list?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


# Andrew's Toy Endpoints
# Let's you pick what you want to see what is trending for the week, but you default to movie
@app.route('/trending/weekly/<type>')
def get_trending_weekly_by_type(type='movie'):
    d = requests.get(
        f'https://api.themoviedb.org/3/trending/{type}/week?api_key=a21eabff9a50895a28e14f57af081a11&language=en-US').content
    print(d)
    return d


# # Let's you pick what you want to see what is trending for the week, but you default to movie
@app.route('/trending/monthly/<type>')
def get_trending_monthly_by_type(type='movie'):
    d = requests.get(
        f'https://api.themoviedb.org/3/trending/{type}/month?api_key=a21eabff9a50895a28e14f57af081a11').content
    print(d)
    return d


# FLASK TESTING ENDPOINTS
@app.route('/hello')
def hello_world():
    print("Hello, world!")
    return 'Hello, world. Now try a different route.'


@app.route('/test')
def test_base_movie_route():
    d = requests.get('https://api.themoviedb.org/3/movie/550?api_key=a21eabff9a50895a28e14f57af081a11').content
    print(d)
    return d

if __name__ == '__main__':
    app.run(use_reloader=True, debug=True)