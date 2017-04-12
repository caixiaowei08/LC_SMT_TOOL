/**
 * Created by User on 2017/4/1.
 */
function generatingCode(){
    var fs = require("fs");
    var Ring_Size_N_Max = 20; //环的大小
    var Ring_Size_N_Min = 10; //环的大小
    var Robot_Size_R = 3; //机器人数
    var SMT_Upper_Bound = 20;
    var rules_array=new Array();
    rules_array[0]="(R2,F2,R1,Fn-5)r.Back";
    rules_array[1]="(R1,F1,R1,Fn-6,R1,F2)r.Front";
    rules_array[2]="(R1,F3,R2,Fn-6)r.Front";

    fs.open("./file/ring.smt2","w",function(err,fd){
        fs.writeSync(fd,new Buffer(";环的大小 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(declare-fun n () Int)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (<= n "+Ring_Size_N_Max+"))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (>= n "+Ring_Size_N_Min+"))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";环的大小 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";机器人数 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(declare-fun r () Int)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (= r "+Robot_Size_R+"))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";机器人数 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";设置SMT上限值 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(declare-const smt_upper_bound Int)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (= smt_upper_bound "+SMT_Upper_Bound+"))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";设置SMT上限值 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";机器人数 和 环节点数 互质 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (forall ((x Int)) (=> (and (> x 1) (<= x r)) (not (and (= (mod n x) 0) (= (mod r x) 0))))))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";机器人数 和 环节点数 互质 定义结束\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";时钟设置 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(declare-fun clock (Int) Int)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (= (clock 1) 1))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (forall ((x Int)) (=> (and (> x 0)  (<= x smt_upper_bound)) (= (clock (+ x 1)) (+ (clock x) 1)))))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";时钟设置 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";位置函数 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(declare-fun postion (Int Int) Int)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (forall ((x Int) (c Int))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=>\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(>= x 1)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= x r)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> c 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= c smt_upper_bound)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(>  (postion x (clock c)) 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= (postion x (clock c)) n)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";位置函数 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";机器人位置限制 一个节点 同一时刻至多有一个机器人  定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (forall ((x Int) (y Int) (c Int))"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=> (and (> x 0) (<= x r) (> y 0) (<= y r) (> c 0) (<= c smt_upper_bound) (distinct x y))"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(distinct"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(postion x (clock c))"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(postion y (clock c))"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";机器人位置限制 一个节点 同一时刻至多有一个机器人  定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";每次移动 只能有一个机器人位置发生变化 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (forall ((x Int) (y Int) (c Int))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=> (and (> x 0) (<= x r) (> y 0) (<= y r) (> c 0) (<= c smt_upper_bound) (distinct x y))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(let (\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(move_x (- (postion x (clock c)) (postion x (clock (+ c 1)))))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(move_y (- (postion y (clock c)) (postion y (clock (+ c 1)))))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(not\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(distinct move_x 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(distinct move_y 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";每次移动 只能有一个机器人位置发生变化 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";根据机器人数量 确定间隙数 定义 初始位置 参数 定义开始\n"),function(err,written,buffer){});
        for(var i=1;i<=Robot_Size_R;i++ ){
            fs.writeSync(fd,new Buffer("(declare-fun pos"+i+"_init () Int)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(";根据机器人数量 确定间隙数 定义 初始位置 参数  定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";利用规则 设定任意初始化参数 定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd, new Buffer("(assert (or\n"), function (err, written, buffer) {});
        for (rule in rules_array) {
            var rule_str = rules_array[rule];
            rule_str = rule_str.substr(rule_str.indexOf("(") + 1, rule_str.indexOf(")") - 1);
            var rule_cells = rule_str.split(",");
            var robot_space = new Array();
            for (var j = 2; j <= Robot_Size_R; j++) {
                var p_i = j - 1;
                var c_i = j;
                var p_i_f = -1;
                var c_i_f = -2;
                var count_robot = 0;
                for (cell_index in rule_cells) {
                    if (cell_index % 2 == 0) {
                        count_robot += parseInt(rule_cells[cell_index].substring(1));
                        if (p_i_f < 0 && count_robot >= p_i) {
                            p_i_f = cell_index;
                        }
                        if (c_i_f < 0 && count_robot >= c_i) {
                            c_i_f = cell_index;
                        }
                        if (p_i_f >= 0 && c_i_f >= 0) {
                            break;
                        }
                    }
                }
                if (p_i_f == c_i_f) {
                    robot_space[c_i] = 1;
                } else {
                    var n = Number(rule_cells[c_i_f - 1].substring(1));
                    console.log("var n:" + n);
                    if (!isNaN(n)) {
                        robot_space[c_i] = n + 1
                    } else {
                        robot_space[c_i] = "(- n " + (Number(rule_cells[c_i_f - 1].substring(3)) - 1) + ")"
                    }
                }
            }
            fs.writeSync(fd, new Buffer("(and\n"), function (err, written, buffer) {});
            for(var m=2;m<=Robot_Size_R;m++ ){//正向数据
                //(R2,F2,R1,Fn-5)
                fs.writeSync(fd,new Buffer("(= pos"+m+"_init (let ((pos"+m+"_init_temp (+ pos"+(m-1)+"_init "+robot_space[m]+"))) (ite (> pos"+m+"_init_temp n) (- pos"+m+"_init_temp n) pos"+m+"_init_temp)))\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
            for(var k=Robot_Size_R;k>=2;k--){//反向数据
                var down_k = k -1;
                fs.writeSync(fd,new Buffer("(= pos"+down_k+"_init (let ((pos"+down_k+"_init_temp (- pos"+k+"_init "+robot_space[(Robot_Size_R - k + 2)]+"))) (ite (< pos"+down_k+"_init_temp 1) (+ pos"+down_k+"_init_temp n) pos"+down_k+"_init_temp)))\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer("))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(";利用规则 设定任意初始化参数 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";初始值赋值 定义开始\n"),function(err,written,buffer){});
        for(var i=1;i<=Robot_Size_R;i++ ){
            fs.writeSync(fd,new Buffer("(assert (= (postion "+i+" (clock 1)) pos"+i+"_init))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(";初始值赋值 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";生成规则 定义开始\n"),function(err,written,buffer){});
        for (rule in rules_array) {
            var rule_str = rules_array[rule];
            rule_str = rule_str.substr(rule_str.indexOf("(")+1,rule_str.indexOf(")")-1);
            var rule_direction_str = rules_array[rule];
            var rule_direction = rule_direction_str.substr(rule_direction_str.indexOf(")")+3);
            var rule_cells =  rule_str.split(",");
            var robot_space = new Array();
            for(var j=2;j<=Robot_Size_R;j++ ) {
                var p_i = j - 1;
                var c_i = j;
                var p_i_f = -1;
                var c_i_f = -2;
                var count_robot = 0;
                for(cell_index in rule_cells){
                    if(cell_index%2==0){
                        count_robot += parseInt(rule_cells[cell_index].substring(1));
                        console.log("r:"+count_robot) ;
                        if(p_i_f<0&&count_robot>=p_i){
                            p_i_f = cell_index;
                        }
                        if(c_i_f<0&&count_robot>=c_i){
                            c_i_f = cell_index;
                        }
                        if(p_i_f>=0&&c_i_f>=0){
                            break;
                        }
                    }
                }
                if(p_i_f==c_i_f){
                    robot_space[c_i] = 0;
                }else{
                    var n = Number(rule_cells[c_i_f-1].substring(1));
                    console.log("var n:"+n);
                    if (!isNaN(n)){
                        robot_space[c_i] = n;
                    }else{
                        robot_space[c_i] = "(- n "+ Number(rule_cells[c_i_f-1].substring(3))+")"
                    }
                }
            }
            //正向规则
            fs.writeSync(fd,new Buffer(";正向规则 生成开始\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(assert (forall ((x Int) (l Int))\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(=> (and (<= l smt_upper_bound)\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(> l 0)\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(> x 0)\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(<= x r)\n"),function(err,written,buffer){});
            for(var k=2;k<=Robot_Size_R;k++ ){
                //(R2,F2,R1,Fn-5)
                var temp_gap_1 = (k-1);
                fs.writeSync(fd,new Buffer("(= (let (\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(next"+temp_gap_1+"_robot_id\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((next"+temp_gap_1+"_robot_id_temp  (+ x "+temp_gap_1+"))) (ite (> next"+temp_gap_1+"_robot_id_temp  r) (- next"+temp_gap_1+"_robot_id_temp r) next"+temp_gap_1+"_robot_id_temp))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                var temp_gap_2 = (k-2);
                fs.writeSync(fd,new Buffer("(next"+temp_gap_2+"_robot_id\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((next"+temp_gap_2+"_robot_id_temp  (+ x "+temp_gap_2+"))) (ite (> next"+temp_gap_2+"_robot_id_temp  r) (- next"+temp_gap_2+"_robot_id_temp r) next"+temp_gap_2+"_robot_id_temp))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("let ((gap_temp (- (postion next"+temp_gap_1+"_robot_id (clock l))  (postion next"+temp_gap_2+"_robot_id (clock l)))))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(ite (< gap_temp 0)\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(- (+ gap_temp n) 1)\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(- gap_temp 1)\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(robot_space[k]+")\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
            if(rule_direction==="Back"){
                fs.writeSync(fd,new Buffer("(= (postion x (clock (+ l 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((pos_temp (- (postion x (clock l)) 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(ite (= pos_temp 0) n pos_temp)\n"),function(err,written,buffer){});
            }else if(rule_direction==="Front"){
                fs.writeSync(fd,new Buffer("(= (postion x (clock (+ l 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((pos_temp_1 (+ (postion x (clock l)) 1))) \n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(ite (> pos_temp_1 n) 1 pos_temp_1)\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(let (\n"),function(err,written,buffer){});
            for(var k=2;k<=Robot_Size_R;k++ ){
                var temp_next_robot_id = k-1;
                fs.writeSync(fd,new Buffer("(next"+temp_next_robot_id+"_robot_id \n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((next"+temp_next_robot_id+"_robot_id_temp  (+ x "+temp_next_robot_id+"))) (ite (> next"+temp_next_robot_id+"_robot_id_temp  r) (- next"+temp_next_robot_id+"_robot_id_temp r) next"+temp_next_robot_id+"_robot_id_temp))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(and \n"),function(err,written,buffer){});
            for(var k=2;k<=Robot_Size_R;k++ ){
                var temp_next_robot_id = k-1;
                fs.writeSync(fd,new Buffer("(= (postion next"+temp_next_robot_id+"_robot_id  (clock (+ l 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(postion next"+temp_next_robot_id+"_robot_id  (clock l ))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(";正向规则 生成结束\n"),function(err,written,buffer){});

            //反向规则
            fs.writeSync(fd,new Buffer(";反向规则 生成开始\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(assert (forall ((x Int) (l Int))\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(=> (and (<= l smt_upper_bound)\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(> l 0)\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(> x 0)\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(<= x r)\n"),function(err,written,buffer){});
            for(var k=2;k<=Robot_Size_R;k++ ){
                //(R2,F2,R1,Fn-5)
                var temp_gap_1 = (k-1);
                fs.writeSync(fd,new Buffer("(= (let (\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(next"+temp_gap_1+"_robot_id\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((next"+temp_gap_1+"_robot_id_temp  (- x "+temp_gap_1+"))) (ite (<= next"+temp_gap_1+"_robot_id_temp  0) (+ next"+temp_gap_1+"_robot_id_temp r) next"+temp_gap_1+"_robot_id_temp))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                var temp_gap_2 = (k-2);
                fs.writeSync(fd,new Buffer("(next"+temp_gap_2+"_robot_id\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((next"+temp_gap_2+"_robot_id_temp  (- x "+temp_gap_2+"))) (ite (<= next"+temp_gap_2+"_robot_id_temp  0) (+ next"+temp_gap_2+"_robot_id_temp r) next"+temp_gap_2+"_robot_id_temp))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("let ((gap_temp (- (postion next"+temp_gap_1+"_robot_id (clock l))  (postion next"+temp_gap_2+"_robot_id (clock l)) )))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(ite (> gap_temp 0)\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(- (- n 2) (- gap_temp 1))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(- (- n 2) (- (+ gap_temp n) 1)) \n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(robot_space[k]+")\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
            if(rule_direction==="Back"){
                fs.writeSync(fd,new Buffer("(= (postion x (clock (+ l 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((pos_temp (+ (postion x (clock l)) 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(ite (> pos_temp n) (- pos_temp n) pos_temp)\n"),function(err,written,buffer){});
            }else if(rule_direction==="Front"){
                fs.writeSync(fd,new Buffer("(= (postion x (clock (+ l 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((pos_temp_1 (+ (postion x (clock l)) 1))) \n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(ite (> pos_temp_1 n) 1 pos_temp_1)\n"),function(err,written,buffer){});
            }

            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(let (\n"),function(err,written,buffer){});
            for(var k=2;k<=Robot_Size_R;k++ ){
                var temp_next_robot_id = k-1;
                fs.writeSync(fd,new Buffer("(next"+temp_next_robot_id+"_robot_id \n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(let ((next"+temp_next_robot_id+"_robot_id_temp  (- x "+temp_next_robot_id+"))) (ite (<= next"+temp_next_robot_id+"_robot_id_temp  0) (+ next"+temp_next_robot_id+"_robot_id_temp r) next"+temp_next_robot_id+"_robot_id_temp))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer("(and \n"),function(err,written,buffer){});
            for(var k=2;k<=Robot_Size_R;k++ ){
                var temp_next_robot_id = k-1;
                fs.writeSync(fd,new Buffer("(= (postion next"+temp_next_robot_id+"_robot_id  (clock (+ l 1)))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer("(postion next"+temp_next_robot_id+"_robot_id  (clock l ))\n"),function(err,written,buffer){});
                fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            }
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
            fs.writeSync(fd,new Buffer(";反向规则 生成结束\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(";规则匹配 定义结束\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer(";重复移动验证生成器  定义开始\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (or\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(forall ((x Int) (y Int))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=> (and (> x 1)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= x smt_upper_bound)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> y 1)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= y smt_upper_bound)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< x y)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (- (postion "+k+" (clock y)) (postion "+k+" (clock x))))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        for(var k=1;k<Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(= move_"+k+"_r move_"+(k+1)+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(forall ((z Int))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=>  (and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> z x)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< z y)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (- (postion "+k+" (clock y)) (postion "+k+" (clock x))))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(not\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        for(var k=1;k<Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(= move_"+k+"_r move_"+(k+1)+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (let ((move_"+k+" (- (postion "+k+" (clock y)) (postion "+k+" (clock x))))) (ite (< move_"+k+" 0) (+ move_"+k+" n) move_"+k+")))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> move_1_r 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< move_1_r n)\n"),function(err,written,buffer){});
        for(var k=1;k<Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(= move_"+k+"_r move_"+(k+1)+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        //反向
        fs.writeSync(fd,new Buffer("(forall ((x Int) (y Int))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=> (and (> x 1)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= x smt_upper_bound)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> y 1)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(<= y smt_upper_bound)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< x y)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (- (postion "+k+" (clock y)) (postion "+k+" (clock x))))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        for(var k=1;k<Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(= move_"+k+"_r move_"+(k+1)+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(forall ((z Int))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(=>  (and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> z x)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< z y)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (let ((move_"+k+" (- (postion "+k+" (clock y)) (postion "+k+" (clock x))))) (ite (< move_"+k+" 0) (+ move_"+k+" n) move_"+k+")))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(not\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        for(var k=1;k<Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(= move_"+k+"_r move_"+(k+1)+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (let ((move_"+k+" (- (postion "+k+" (clock y)) (postion "+k+" (clock x))))) (ite (> move_"+k+" 0) (- move_"+k+" n) move_"+k+")))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< move_1_r 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> move_1_r (- 0 n))\n"),function(err,written,buffer){});
        for(var k=1;k<Robot_Size_R;k++ ){
            fs.writeSync(fd,new Buffer("(= move_"+k+"_r move_"+(k+1)+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});

       /** fs.writeSync(fd,new Buffer("(declare-fun c_num () Int)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(assert (and (< c_num smt_upper_bound) (> c_num 0)))\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("(assert (or (let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ) {
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (let ((move_"+k+" (- (postion "+k+" (clock c_num)) (postion "+k+" (clock 1))))) (ite (< move_"+k+" 0) (+ move_"+k+" n) move_"+k+")))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> move_1_r 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< move_1_r n)\n"),function(err,written,buffer){});
        for(var k=2;k<=Robot_Size_R;k++ ) {
            fs.writeSync(fd,new Buffer("(= move_"+(k-1)+"_r move_"+k+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("(let\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(\n"),function(err,written,buffer){});
        for(var k=1;k<=Robot_Size_R;k++ ) {
            fs.writeSync(fd,new Buffer("(move_"+k+"_r (let ((move_"+k+" (- (postion "+k+" (clock c_num)) (postion "+k+" (clock 1))))) (ite (> move_"+k+" 0) (- move_"+k+" n) move_"+k+")))\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(and\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(< move_1_r 0)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(> move_1_r (- 0 n))\n"),function(err,written,buffer){});
        for(var k=2;k<=Robot_Size_R;k++ ) {
            fs.writeSync(fd,new Buffer("(= move_"+(k-1)+"_r move_"+k+"_r)\n"),function(err,written,buffer){});
        }
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer(")\n"),function(err,written,buffer){});*/
        fs.writeSync(fd,new Buffer(";重复移动验证生成器  定义结束\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("\n"),function(err,written,buffer){});

        fs.writeSync(fd,new Buffer("(check-sat)\n"),function(err,written,buffer){});
        fs.writeSync(fd,new Buffer("(get-value (n))\n"),function(err,written,buffer){});

        for(var i=1;i<=SMT_Upper_Bound;i++){
            for(var j=1;j<=Robot_Size_R;j++){
               fs.writeSync(fd,new Buffer("(get-value ((postion "+j+" (clock "+i+"))))\n"),function(err,written,buffer){});
            }
        }
        fs.writeSync(fd,new Buffer("(get-model)\n"),function(err,written,buffer){});

    });

    fs.readFile('./file/ring.smt2','utf-8', function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    })
    const child_process = require('child_process');
    var workerProcess = child_process.spawn('z3', ['./file/ring.smt2']);
    workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
}