BiwaScheme.REPL = {
  initialize: function() {
    // run trace mode
    BiwaScheme.define_libfunc("trace", 0, 0, function(args) {
      trace = !trace;
      return BiwaScheme.undef;
    });

    // return all procedures from global environment
    BiwaScheme.define_libfunc('env', 0, 0, function(args) {
      var result = new Array();
      for(fun in BiwaScheme.CoreEnv) {
        result[result.length] = fun;
      }
      return BiwaScheme.array_to_list(result);
    });

    // return list of object properties like dir from python
    BiwaScheme.define_libfunc('dir', 1, 1, function(args) {
      var result = [];
      var object = args[0];
      for (i in object) {
        result.push(i);
      }
      return BiwaScheme.array_to_list(result);
    });

    // check if object is in list
    BiwaScheme.define_libfunc('contains?', 2, 2, function(args) {
      BiwaScheme.assert_list(args[1]);
      return BiwaScheme._.contains(args[1].to_array(), args[0]);
    });
    
    // concatenate two or more string
    BiwaScheme.define_libfunc("concat", 1, null, function(args) {
      for (var i=args.length; i--;) {
        BiwaScheme.assert_string(args[i]);
      }
      return args.length == 1 ? args[0] : args.join('');
    });

    BiwaScheme.define_libfunc("join", 2, 2, function(args) {
      BiwaScheme.assert_list(args[1]);
      BiwaScheme.assert_string(args[0]);
      var array = args[1].to_array();
      for (var i=array.length; i--;) {
        BiwaScheme.assert_string(array[i]);
      }
      return array.join(args[0]);
    });

    BiwaScheme.define_libfunc("split", 2, 2, function(args) {
      BiwaScheme.assert_string(args[0]);
      BiwaScheme.assert_string(args[1]);
      var result = args[1].split(args[0]);
      return result.to_list();
    });
  },

  balanced_parentheses: function(text_code) {
    var tokens = (new BiwaScheme.Parser(text_code)).tokens;
    var parentheses = 0;
    var brackets = 0;

    for(var i=0; i<tokens.length; ++i) {
      switch(tokens[i]) {
      case "[":  ++brackets; break;
      case "]":  --brackets; break;
      case "#(": ++parentheses; break;
      case "(":  ++parentheses; break;
      case ")":  --parentheses; break;
      }
    }
    return parentheses === 0 && brackets === 0;
  }
};
