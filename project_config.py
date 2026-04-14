# -*- coding: utf-8 -*-
import json
import os


def _default_config_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'project_config.json')


def load_project_config():
    """
    读取统一配置文件。
    优先级：
    1) 环境变量 RPS_CONFIG_PATH 指向的 json
    2) 当前目录下 project_config.json
    """
    cfg_path = os.environ.get('RPS_CONFIG_PATH', '').strip() or _default_config_path()
    if not os.path.isfile(cfg_path):
        return {}
    try:
        with open(cfg_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def get_cfg(config, *keys, default=None):
    cur = config
    for k in keys:
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur
