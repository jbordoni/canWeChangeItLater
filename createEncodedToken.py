keyfile = open("AuthKey_NLJ838FQZD.p8", "r")
>>> keystring = keyfile.read()
>>> encoded = jwt.encode({"iss":"N33P7VGWUR", "iat":"1508105348", "exp":"1514585430"}, keystring, algorithm="ES256")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'jwt' is not defined
>>> import jwt
>>> encoded = jwt.encode({"iss":"N33P7VGWUR", "iat":"1508105348", "exp":"1514585430"}, keystring, algorithm="ES256")
>>> encoded
'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJOMzNQN1ZHV1VSIiwiaWF0IjoiMTUwODEwNTM0OCIsImV4cCI6IjE1MTQ1ODU0MzAifQ.9BUDhETVWD7eecqjnzK6XaZYTfjKt_IXKDFs4xav6JaZdc8avMvHETWs13_HhuDYHtCXCEyiTIjAIIsRGj1-fA'