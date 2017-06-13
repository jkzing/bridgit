# bridgit

[![npm version](https://badge.fury.io/js/bridgit.svg)](https://badge.fury.io/js/bridgit)
[![Build Status](https://travis-ci.org/jkzing/bridgit.svg?branch=master)](https://travis-ci.org/jkzing/bridgit)
[![Coverage Status](https://coveralls.io/repos/github/jkzing/bridgit/badge.svg?branch=master)](https://coveralls.io/github/jkzing/bridgit?branch=master)

bridgit is a proxy server intend to forward http request to a server with authentication.

Support different authentication protocol. (hawk for now)

# Installation

```
npm install -g bridgit
```

# Commands

## hawk

Simply use follow command to start the proxy server for hawk authentication.

``` bash
bridgit hawk
```

Initially, the proxy server would intercept request from http://127.0.0.1:3000,
encrypt the request with hawk,
add the authentication artifact in request header as `Authorization`,
and foward it to the same uri at http://127.0.0.1:8000.

So you can call your RESTful API at http://127.0.0.1:3000/your_api_uri now.

There are several options you can use to customize the proxy server:

``` bash
bridgit hawk
    [-o, --origin=] # origin to forward
    [-p, --port=] # server port for bridgit to listen on
    [-P, --prefix=] # auth header prefix
    [-i, --id=] # hawk credentials id
    [-k, --key=] # hawk crendentials key
    [-a, --algorithm=] # hawk algorithm
    [-E, --encrypt-payload=] # should include payload when encrypt
    [-c, --config=] # With a specified config file path
```
You can also use `bridgit hawk --help` to view available options.

Here are some usage examples:

### Use with options
``` bash
bridgit hawk -i your_id -k your_key -o http://www.google.com
```
Will start hawk server with `your_id` and `your_key`, then proxy request to `http://www.google.com`.

### Use with config file
``` bash
bridgit hawk -c ~/config.json
```
Will load ~/config.json as your configuration, and keep global config as defaults.

> NOTE: the config file you are using is considered in JSON format, please ensure that.


## config

> From 1.1.0, default configuration file will be generated under your $HOME directory, named .bridgit.json.

### set/get global configurations

`bridgit config set <key> <value>`
or
`bridgit config get <key>`

Here `key` can be any support option in proxy server command (like hawk).

``` bash
bridgit config set id your_id # store your_id as id in config file
bridgit config set port 4000 # store 4000 as port in config file
bridgit config get port # print current port config
bridgit config get # print all key-values in config file
```

> NOTE: You should only use fullname for options to set config, shortland name will not take effect.


PS: The options' priority is higher than config file. For example:

``` bash
bridgit config set id id_config
bridgit hawk --id=id_option
```
Will result in proxy server using `id_options` as hawk id.

### generate an empty config file
``` bash
bridgit config new ~/your_config.json
```
Will create a new empty config file @~/your_config.json.

# Todo

* Test cases coverage
* Support OAuth2
