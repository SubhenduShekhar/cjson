import setuptools

__readme_file = open("README.md")
__description = __readme_file.read()

setuptools.setup(
    name="cjson",
    version="1.0.0",
    description="Coded JSON files. Save your files with .cjson extension to unlock these features",
    long_description=__description,
    author="Shubhendu Shekhar Gupta",
    author_email="subhendushekhargupta@gmail.com",
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