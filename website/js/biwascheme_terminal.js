jQuery(document).ready(function($, undefined) {
    //NOTE: $ is jQuery in this scope
    var trace = false;
    var bscheme = new BiwaScheme.Interpreter(function(e, state) {
       term.error(e.message);
    });

    BiwaScheme.REPL.initialize();

    Console.puts = function(string) {
        term.echo(string);
    };
    BiwaScheme.Port.current_output = new BiwaScheme.Port.CustomOutput(
        Console.puts
    );
    var code_to_evaluate = '';
    var term = $('#term').terminal(function(command, term) {
        code_to_evaluate += ' ' + command;
        if (BiwaScheme.REPL.balanced_parentheses(code_to_evaluate)) {
            try {
                if (trace) {
                    var opc = biwascheme.compile(code_to_evaluate);
                    var dump_opc = (new BiwaScheme.Dumper()).dump_opc(opc);
                    term.echo(dump_opc, {raw: true});
                }
                bscheme.evaluate(code_to_evaluate, function(result) {
                    if (result !== undefined && result !== BiwaScheme.undef) {
                        term.echo('=> ' + BiwaScheme.to_write(result));
                    }
                });
            } catch(e) {
                term.error(e.message);
                code_to_evaluate = '';
                throw(e);
            }
            term.set_prompt('biwascheme>');
            code_to_evaluate = '';
        } else {
            term.set_prompt('...            ');
        }
    }, {
        greetings: 'BiwaScheme Interpreter version ' + BiwaScheme.Version +
                   '\nCopyright (C) 2007-2014 Yutaka HARA and the BiwaScheme team',
        width: 500,
        height: 250,
        name: 'biwa',
        exit: false,
        prompt: 'biwascheme>'
    });

    // redefine sleep it sould pause terminal
    BiwaScheme.define_libfunc("sleep", 1, 1, function(ar){
        var sec = ar[0];
        assert_real(sec);
        term.pause();
        return new BiwaScheme.Pause(function(pause){
            setTimeout(function(){
                term.resume();
                pause.resume(nil);
            }, sec * 1000);
        });
    });
    /*
    // load should pause terminal
    BiwaScheme.define_libfunc("load", 1, 1, function(ar, intp){
        var path = ar[0];
        assert_string(path);
        term.pause();
        return new BiwaScheme.Pause(function(pause){
            $.ajax({
                url: path,
                processData: false,
                success: function(data) {
                    term.resume();
                    term.echo(data);
                    term.echo(pause instanceof BiwaScheme.Pause);
                    try {
                        // throw too much recursion here
                        bscheme.evaluate(data, function() {
                            return pause.resume(BiwaScheme.undef);
                        });
                        term.echo(path + ' loaded');
                    } catch(e) {
                        term.error(e.message);
                        throw(e);
                    }
                },
                error: function(xhr, stat) {
                    term.error("[AJAX] " + stat + " server reponse: \n" + 
                               xhr.reponseText);
                }});
        });
    });
    */
    // clear terminal
    BiwaScheme.define_libfunc('clear', 0, 0, function(args) {
        term.clear();
        return BiwaScheme.undef;
    });
});
