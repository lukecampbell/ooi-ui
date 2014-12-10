#!/usr/bin/env python
'''
ooiui.science.routes

Defines the application routes
'''
from ooiui.science.app import app
from flask import request, render_template, Response
from ooiui.config import TABLEDAP, SERVICES_URL, DEBUG, ERDDAP_URL, SERVICES_CONFIG

from ooiui.science.interface import tabledap as tabled
from ooiui.science.interface.toc import get_toc as get_toc_interface, flush_cache
from ooiui.science.interface.timecoverage import get_times_for_stream

import requests
import os
import json
from datetime import datetime,timedelta
import time
import numpy as np
import math
import yaml

@app.route('/pioneer/')
def pioneer():
    return app.send_static_file('pioneer_landing.html')

@app.route('/getdata/')
def getData():
    instr = request.args['dataset_id']    
    std = request.args['startdate']
    edd = request.args['enddate']
    param = request.args['variables']
    tav = request.args['timeaverage']
    tp = request.args['timeperiod']

    print tav
    
    if (tav=="true"):
        r = tabled.getFormattedJsonData(instr,std,edd,param)
    else:
        r = tabled.getTimeSeriesJsonData(instr,std,edd,param);

    import re
    r = re.sub(r'NaN', '"NaN"', r)
    
    resp = Response(response=r, status=200, mimetype="application/json")
    return resp

@app.route('/files')
def files():
    return render_template('filebrowser.html')

@app.route('/get_time_coverage/<ref>/<stream>')
def get_time_coverage(ref, stream):
    data = get_times_for_stream(ref, stream)
    resp = Response(response=json.dumps(data), status=200, mimetype="application/json")
    return resp
        
@app.route('/gettoc/')
def get_toc():
    return get_toc_interface()

@app.route('/flush')
def flush():
    flush_cache()
    response = Response(response='{"status":"ok"}', status=200, mimetype="application/json")
    return response


@app.route('/')
def root():
    return render_template('index.html', erddap_url=ERDDAP_URL)

@app.route('/update_erddap/<path:dir_path>')
def update_erddap(dir_path):
    dir_path = '/' + dir_path
    response = {}
    if not os.path.exists(dir_path):
        response['status'] = 'fail'
        response['message'] = 'Directory %s does not exist' % dir_path
        response = Response(response=json.dumps(response), status=500, mimetype='application/json')
        return response
    dir_path = dir_path.encode('ascii', 'ignore')

    with open(SERVICES_CONFIG, 'r') as f:
        doc = yaml.load(f.read()) or {}
        doc['DATASETS_DIR'] = dir_path
    with open(SERVICES_CONFIG, 'w') as f:
        f.write(yaml.dump(doc, default_flow_style=False))


    response['status'] = 'ok'
    response['path'] = dir_path
    response = Response(response=json.dumps(response), status=200, mimetype='application/json')
    return response

