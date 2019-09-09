# Developer Guide

## Environment


### Python

The instructions in [Install standalone application directly from the source](https://github.com/lyft/amundsenfrontendlibrary/blob/master/docs/installation.md#install-standalone-application-directly-from-the-source) are for running the application as-is. If you wish instead to develop against the python code, the recommended method of installation is as follows:

```bash
# Clone repo
$ git clone https://github.com/lyft/amundsenfrontendlibrary.git

$ cd amundsenfrontendlibrary
# Install python resources
$ python3 -m venv venv
$ source venv/bin/activate
(venv) $ pip3 install -r requirements3.txt
(venv) $ python3 setup.py develop

# Start server
(venv) $ FLASK_ENV=development python3 amundsen_application/wsgi.py
# visit http://localhost:5000 to confirm the application is running
```

The difference is subtle but significant - instead of running `python3 setup.py install`, which copies the files from the application to the relevant locations, we are using `python3 setup.py develop` which will only link the files - meaning you can continue to edit the files python files in `~/<your-path-to-cloned-repo>/amundsenfrontendlibrary/amundsen_application`.

*TODO: Is there a way to cause flask to hot-reload the changes, so a simple refresh will work?*


The `FLASK_ENV=development` will enable the wsgi to reload when it detects changes. To test local changes to the python files, simply refresh the page. 

### JavaScript:
Install the javascript development requirements:

```bash
# in ~/<your-path-to-cloned-repo>/amundsenfrontendlibrary/amundsen_application/static
$ npm install --only=dev
```

While you can make changes to the javascript and restart `python3 amundsen_application/wsgi.py` for those changes to take effect, the process is time consuming and inefficient. To enable realtime changes to javascript, we will keep the wsgi application running on port 5000 and in addition start a node.js server on port 8080. If you then use your browser on port 8080, you can have realtime hot-reloading of javascript as well as the python/wsgi behavior documented above. To enable this, run these commands in a new terminal:

        # in ~/<your-path-to-cloned-repo>/amundsenfrontendlibrary/amundsen_application/static
        $ npm run start-server # starts a server on http://localhost:8080
        
  If you now browse to http://localhost:8080, you will have real-time javascript hot reloading. You can edit (most, excludes the webpack*ts files and a few others) files under `~/<your-path-to-cloned-repo>/amundsenfrontendlibrary/amundsen_application/static/js`
  This method will serve all files from the node.js servers, and if a request to a python file comes in, node.js will automatically proxy the request to your wsgi server on port 5000 without any configuration.

## Contributing

### Testing
#### Python

If changes were made to any python files, run the python unit tests, linter, and type checker. Unit tests are run with `py.test`. They are located in `tests/unit`. Type checks are run with `mypy`. Linting is `flake8`. There are friendly `make` targets for each of these tests:
```bash
# after setting up environment
make test  # unit tests in Python 3
make lint  # flake8
make mypy  # type checks
```
Fix all errors before submitting a PR.

#### JS Assets

##### Type Checking
`npm run tsc` conducts type checking. The build commands `npm run build` and `npm run dev-build` also conduct type checking, but are slower because they also build the source code. Run any of these commands and fix all failed checks before submitting a PR.

##### Lint
`npm run lint` runs the linter. Fix all lint errors before submitting a PR. `npm run lint-fix` can help auto-fix most common errors.

##### Unit Tests
`npm run test` runs unit tests. Add unit tests to cover new code additions and fix any test failures before submitting a PR.

To run specific tests, run `npm run test-nocov -t <regex>`, where `<regex>` is any pattern that matches the names of the test blocks that you want to run.

See our recommendations for writing unit tests [here](https://github.com/lyft/amundsenfrontendlibrary/blob/master/docs/recommended-practices.md).
