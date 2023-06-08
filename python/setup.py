import setuptools

__readme_file = open("README.md")
__description = __readme_file.read()

setuptools.setup(
    name="coded-json",
    version="1.0.0",
    description="Coded JSON files. Save your files with .cjson extension to unlock these features",
    long_description=__description,
    author="Shubhendu Shekhar Gupta",
    author_email="subhendushekhargupta@gmail.com",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ],
    py_modules=["coded-json"],
    package_dir={ '':'cjson/src' }
)