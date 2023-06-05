import setuptools

setuptools.setup(
    name="coded-json",
    version="1.0.0",
    author="Shubhendu Shekhar Gupta",
    description="Coded JavaScript Object Notation",
    long_description="",
    author_email="subhendushekhargupta@gmail.com",
    package_data=setuptools.find_packages(),
    classifiers = [
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ],
    requires=">=3.10",
    py_modules=["coded-json"],
    package_dir={ '':'cjson/src' },
    include_dirs=[]
)