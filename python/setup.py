import setuptools

__readme_file = open("README.md")
__description = __readme_file.read()

setuptools.setup(
    name="codedjson",
    keywords=["coded", "json", "cjson", "codedjson", "coded-json"],
    version="2.0.0",
    description="CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python and Java, users has experienced data reusability. For features and examples, please refer to official github readme",
    long_description=__description,
    long_description_content_type="text/markdown",
    author="Shubhendu Shekhar Gupta",
    author_email="subhendushekhargupta@gmail.com",
    url="https://github.com/SubhenduShekhar/cjson",
    packages= [".", "utils/"],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ],
    include_package_data=True,
    include_dirs=[ "utils" ],
    py_modules=["cjson"],
    package_dir={ '':'cjson/src' }
)