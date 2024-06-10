.. CodedJson documentation master file, created by
   sphinx-quickstart on Fri Jan  5 15:00:19 2024.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome
========

Coded JSON(officially CJSON) is an extended format of JSON formatted data storage, which gives
you more previledge to organize data into more structured format.

Here is an example for `CJSON` format:

.. code-block::
   
   {
      "source": $import "./source.json",
      "target": {
         "fruit": "Apple",
         "size": "Large",
         "color": "Red",
         "secColor": $.target.color,
         "colorList": [ $.target.color, $.target.secColor ],
         // You can add comments like this
         "digitCheck": 1.5,
         "digitImport": $.target.digitCheck,
         "digitArrayImport": [ $.target.digitCheck, $.target.digitImport ]
      }
   }


The above `CJSON` snipped will be deserialized in JSON format and can be used 
as same as other JSON files.

For other details, please refer to official page: https://subhendushekhar.github.io/cjson/

CJSON Syntax
============

`CJSON` is an enhanced version of `JSON` file format. But it targets more reusability and structured data storage.

Import multiple JSON files
==========================

One of the strong feature which we have introduced is importing CJson/Json files in another CJson file.
It works in the similar way, how we import libraries in programming languages. All you need to import it using 
`$import "path/to/target/file"` and `deserialize` the file.

Single/ Multiple line comments
==============================

CJSON also supports **commented lines** by adding `//` at the start of the line.

*Please note, inline comments are not supported. Contributers create an issue [here](https://github.com/users/SubhenduShekhar/projects/7)*


Dynamic variable injection
==========================

You can inject a variable dynamically also. Instead of replacing a variable value by parsing as `gson` object, put a key in format `<keyToBeReplaced>` like below:

.. code-block::

   {
      "idValue": <id>
   }


Now create a `HashMap` with key as `<id>` and store relevant value in it.
While invoking `inject` function, pass the HashMap as the second parameter.

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
