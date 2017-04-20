;环的大小 定义开始
(declare-fun n () Int)
(assert (<= n 20))
(assert (>= n 10))
;环的大小 定义结束

;机器人数 定义开始
(declare-fun r () Int)
(assert (= r 3))
;机器人数 定义结束

;设置SMT上限值 定义开始
(declare-const smt_upper_bound Int)
(assert (= smt_upper_bound 20))
;设置SMT上限值 定义结束

;机器人数 和 环节点数 互质 定义开始
(assert (forall ((x Int)) (=> (and (> x 1) (<= x r)) (not (and (= (mod n x) 0) (= (mod r x) 0))))))
;机器人数 和 环节点数 互质 定义结束

;时钟设置 定义开始
(declare-fun clock (Int) Int)
(assert (= (clock 1) 1))
(assert (forall ((x Int)) (=> (and (> x 0)  (<= x smt_upper_bound)) (= (clock (+ x 1)) (+ (clock x) 1)))))
;时钟设置 定义结束

;位置函数 定义开始
(declare-fun postion (Int Int) Int)
(assert (forall ((x Int) (c Int))
(=>
(and
(>= x 1)
(<= x r)
(> c 0)
(<= c smt_upper_bound)
)
(and
(>  (postion x (clock c)) 0)
(<= (postion x (clock c)) n)
)
)
)
)
;位置函数 定义结束

;机器人位置限制 一个节点 同一时刻至多有一个机器人  定义开始
(assert (forall ((x Int) (y Int) (c Int))(=> (and (> x 0) (<= x r) (> y 0) (<= y r) (> c 0) (<= c smt_upper_bound) (distinct x y))(distinct(postion x (clock c))(postion y (clock c))))));机器人位置限制 一个节点 同一时刻至多有一个机器人  定义结束

;每次移动 只能有一个机器人位置发生变化 定义开始
(assert (forall ((x Int) (y Int) (c Int))
(=> (and (> x 0) (<= x r) (> y 0) (<= y r) (> c 0) (<= c smt_upper_bound) (distinct x y))
(let (
(move_x (- (postion x (clock c)) (postion x (clock (+ c 1)))))
(move_y (- (postion y (clock c)) (postion y (clock (+ c 1)))))
)
(not
(and
(distinct move_x 0)
(distinct move_y 0)
)
)
)
)
)
)
;每次移动 只能有一个机器人位置发生变化 定义结束

;根据机器人数量 确定间隙数 定义 初始位置 参数 定义开始
(declare-fun pos1_init () Int)
(declare-fun pos2_init () Int)
(declare-fun pos3_init () Int)
;根据机器人数量 确定间隙数 定义 初始位置 参数  定义结束

;利用规则 设定任意初始化参数 定义开始
(assert (or
(and
(= pos2_init (let ((pos2_init_temp (+ pos1_init 1))) (ite (> pos2_init_temp n) (- pos2_init_temp n) pos2_init_temp)))
(= pos3_init (let ((pos3_init_temp (+ pos2_init 3))) (ite (> pos3_init_temp n) (- pos3_init_temp n) pos3_init_temp)))
)
(and
(= pos2_init (let ((pos2_init_temp (- pos3_init 1))) (ite (< pos2_init_temp 1) (+ pos2_init_temp n) pos2_init_temp)))
(= pos1_init (let ((pos1_init_temp (- pos2_init 3))) (ite (< pos1_init_temp 1) (+ pos1_init_temp n) pos1_init_temp)))
)
(and
(= pos2_init (let ((pos2_init_temp (+ pos1_init 2))) (ite (> pos2_init_temp n) (- pos2_init_temp n) pos2_init_temp)))
(= pos3_init (let ((pos3_init_temp (+ pos2_init (- n 5)))) (ite (> pos3_init_temp n) (- pos3_init_temp n) pos3_init_temp)))
)
(and
(= pos2_init (let ((pos2_init_temp (- pos3_init 2))) (ite (< pos2_init_temp 1) (+ pos2_init_temp n) pos2_init_temp)))
(= pos1_init (let ((pos1_init_temp (- pos2_init (- n 5)))) (ite (< pos1_init_temp 1) (+ pos1_init_temp n) pos1_init_temp)))
)
(and
(= pos2_init (let ((pos2_init_temp (+ pos1_init 4))) (ite (> pos2_init_temp n) (- pos2_init_temp n) pos2_init_temp)))
(= pos3_init (let ((pos3_init_temp (+ pos2_init 1))) (ite (> pos3_init_temp n) (- pos3_init_temp n) pos3_init_temp)))
)
(and
(= pos2_init (let ((pos2_init_temp (- pos3_init 4))) (ite (< pos2_init_temp 1) (+ pos2_init_temp n) pos2_init_temp)))
(= pos1_init (let ((pos1_init_temp (- pos2_init 1))) (ite (< pos1_init_temp 1) (+ pos1_init_temp n) pos1_init_temp)))
)
))
;利用规则 设定任意初始化参数 定义结束

;初始值赋值 定义开始
(assert (= (postion 1 (clock 1)) pos1_init))
(assert (= (postion 2 (clock 1)) pos2_init))
(assert (= (postion 3 (clock 1)) pos3_init))
;初始值赋值 定义结束

;生成规则 定义开始
;正向规则 生成开始
(assert (forall ((x Int) (l Int))
(=> (and (<= l smt_upper_bound)
(> l 0)
(> x 0)
(<= x r)
(= (let (
(next1_robot_id
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
(next0_robot_id
(let ((next0_robot_id_temp  (+ x 0))) (ite (> next0_robot_id_temp  r) (- next0_robot_id_temp r) next0_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next1_robot_id (clock l))  (postion next0_robot_id (clock l)))))
(ite (< gap_temp 0)
(- (+ gap_temp n) 1)
(- gap_temp 1)
)
)
)
0)
(= (let (
(next2_robot_id
(let ((next2_robot_id_temp  (+ x 2))) (ite (> next2_robot_id_temp  r) (- next2_robot_id_temp r) next2_robot_id_temp))
)
(next1_robot_id
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next2_robot_id (clock l))  (postion next1_robot_id (clock l)))))
(ite (< gap_temp 0)
(- (+ gap_temp n) 1)
(- gap_temp 1)
)
)
)
2)
)
(and
(= (postion x (clock (+ l 1)))
(let ((pos_temp (- (postion x (clock l)) 1)))
(ite (= pos_temp 0) n pos_temp)
)
)
(let (
(next1_robot_id 
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
(next2_robot_id 
(let ((next2_robot_id_temp  (+ x 2))) (ite (> next2_robot_id_temp  r) (- next2_robot_id_temp r) next2_robot_id_temp))
)
)
(and 
(= (postion next1_robot_id  (clock (+ l 1)))
(postion next1_robot_id  (clock l ))
)
(= (postion next2_robot_id  (clock (+ l 1)))
(postion next2_robot_id  (clock l ))
)
)
)
)
)
)
)
;正向规则 生成结束
;反向规则 生成开始
(assert (forall ((x Int) (l Int))
(=> (and (<= l smt_upper_bound)
(> l 0)
(> x 0)
(<= x r)
(= (let (
(next1_robot_id
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
(next0_robot_id
(let ((next0_robot_id_temp  (- x 0))) (ite (<= next0_robot_id_temp  0) (+ next0_robot_id_temp r) next0_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next1_robot_id (clock l))  (postion next0_robot_id (clock l)) )))
(ite (> gap_temp 0)
(- (- n 2) (- gap_temp 1))
(- (- n 2) (- (+ gap_temp n) 1)) 
)
)
)
0)
(= (let (
(next2_robot_id
(let ((next2_robot_id_temp  (- x 2))) (ite (<= next2_robot_id_temp  0) (+ next2_robot_id_temp r) next2_robot_id_temp))
)
(next1_robot_id
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next2_robot_id (clock l))  (postion next1_robot_id (clock l)) )))
(ite (> gap_temp 0)
(- (- n 2) (- gap_temp 1))
(- (- n 2) (- (+ gap_temp n) 1)) 
)
)
)
2)
)
(and
(= (postion x (clock (+ l 1)))
(let ((pos_temp (+ (postion x (clock l)) 1)))
(ite (> pos_temp n) (- pos_temp n) pos_temp)
)
)
(let (
(next1_robot_id 
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
(next2_robot_id 
(let ((next2_robot_id_temp  (- x 2))) (ite (<= next2_robot_id_temp  0) (+ next2_robot_id_temp r) next2_robot_id_temp))
)
)
(and 
(= (postion next1_robot_id  (clock (+ l 1)))
(postion next1_robot_id  (clock l ))
)
(= (postion next2_robot_id  (clock (+ l 1)))
(postion next2_robot_id  (clock l ))
)
)
)
)
)
)
)
;反向规则 生成结束
;正向规则 生成开始
(assert (forall ((x Int) (l Int))
(=> (and (<= l smt_upper_bound)
(> l 0)
(> x 0)
(<= x r)
(= (let (
(next1_robot_id
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
(next0_robot_id
(let ((next0_robot_id_temp  (+ x 0))) (ite (> next0_robot_id_temp  r) (- next0_robot_id_temp r) next0_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next1_robot_id (clock l))  (postion next0_robot_id (clock l)))))
(ite (< gap_temp 0)
(- (+ gap_temp n) 1)
(- gap_temp 1)
)
)
)
1)
(= (let (
(next2_robot_id
(let ((next2_robot_id_temp  (+ x 2))) (ite (> next2_robot_id_temp  r) (- next2_robot_id_temp r) next2_robot_id_temp))
)
(next1_robot_id
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next2_robot_id (clock l))  (postion next1_robot_id (clock l)))))
(ite (< gap_temp 0)
(- (+ gap_temp n) 1)
(- gap_temp 1)
)
)
)
(- n 6))
)
(and
(= (postion x (clock (+ l 1)))
(let ((pos_temp_1 (+ (postion x (clock l)) 1))) 
(ite (> pos_temp_1 n) 1 pos_temp_1)
)
)
(let (
(next1_robot_id 
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
(next2_robot_id 
(let ((next2_robot_id_temp  (+ x 2))) (ite (> next2_robot_id_temp  r) (- next2_robot_id_temp r) next2_robot_id_temp))
)
)
(and 
(= (postion next1_robot_id  (clock (+ l 1)))
(postion next1_robot_id  (clock l ))
)
(= (postion next2_robot_id  (clock (+ l 1)))
(postion next2_robot_id  (clock l ))
)
)
)
)
)
)
)
;正向规则 生成结束
;反向规则 生成开始
(assert (forall ((x Int) (l Int))
(=> (and (<= l smt_upper_bound)
(> l 0)
(> x 0)
(<= x r)
(= (let (
(next1_robot_id
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
(next0_robot_id
(let ((next0_robot_id_temp  (- x 0))) (ite (<= next0_robot_id_temp  0) (+ next0_robot_id_temp r) next0_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next1_robot_id (clock l))  (postion next0_robot_id (clock l)) )))
(ite (> gap_temp 0)
(- (- n 2) (- gap_temp 1))
(- (- n 2) (- (+ gap_temp n) 1)) 
)
)
)
1)
(= (let (
(next2_robot_id
(let ((next2_robot_id_temp  (- x 2))) (ite (<= next2_robot_id_temp  0) (+ next2_robot_id_temp r) next2_robot_id_temp))
)
(next1_robot_id
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next2_robot_id (clock l))  (postion next1_robot_id (clock l)) )))
(ite (> gap_temp 0)
(- (- n 2) (- gap_temp 1))
(- (- n 2) (- (+ gap_temp n) 1)) 
)
)
)
(- n 6))
)
(and
(= (postion x (clock (+ l 1)))
(let ((pos_temp_1 (+ (postion x (clock l)) 1))) 
(ite (> pos_temp_1 n) 1 pos_temp_1)
)
)
(let (
(next1_robot_id 
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
(next2_robot_id 
(let ((next2_robot_id_temp  (- x 2))) (ite (<= next2_robot_id_temp  0) (+ next2_robot_id_temp r) next2_robot_id_temp))
)
)
(and 
(= (postion next1_robot_id  (clock (+ l 1)))
(postion next1_robot_id  (clock l ))
)
(= (postion next2_robot_id  (clock (+ l 1)))
(postion next2_robot_id  (clock l ))
)
)
)
)
)
)
)
;反向规则 生成结束
;正向规则 生成开始
(assert (forall ((x Int) (l Int))
(=> (and (<= l smt_upper_bound)
(> l 0)
(> x 0)
(<= x r)
(= (let (
(next1_robot_id
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
(next0_robot_id
(let ((next0_robot_id_temp  (+ x 0))) (ite (> next0_robot_id_temp  r) (- next0_robot_id_temp r) next0_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next1_robot_id (clock l))  (postion next0_robot_id (clock l)))))
(ite (< gap_temp 0)
(- (+ gap_temp n) 1)
(- gap_temp 1)
)
)
)
3)
(= (let (
(next2_robot_id
(let ((next2_robot_id_temp  (+ x 2))) (ite (> next2_robot_id_temp  r) (- next2_robot_id_temp r) next2_robot_id_temp))
)
(next1_robot_id
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next2_robot_id (clock l))  (postion next1_robot_id (clock l)))))
(ite (< gap_temp 0)
(- (+ gap_temp n) 1)
(- gap_temp 1)
)
)
)
0)
)
(and
(= (postion x (clock (+ l 1)))
(let ((pos_temp_1 (+ (postion x (clock l)) 1))) 
(ite (> pos_temp_1 n) 1 pos_temp_1)
)
)
(let (
(next1_robot_id 
(let ((next1_robot_id_temp  (+ x 1))) (ite (> next1_robot_id_temp  r) (- next1_robot_id_temp r) next1_robot_id_temp))
)
(next2_robot_id 
(let ((next2_robot_id_temp  (+ x 2))) (ite (> next2_robot_id_temp  r) (- next2_robot_id_temp r) next2_robot_id_temp))
)
)
(and 
(= (postion next1_robot_id  (clock (+ l 1)))
(postion next1_robot_id  (clock l ))
)
(= (postion next2_robot_id  (clock (+ l 1)))
(postion next2_robot_id  (clock l ))
)
)
)
)
)
)
)
;正向规则 生成结束
;反向规则 生成开始
(assert (forall ((x Int) (l Int))
(=> (and (<= l smt_upper_bound)
(> l 0)
(> x 0)
(<= x r)
(= (let (
(next1_robot_id
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
(next0_robot_id
(let ((next0_robot_id_temp  (- x 0))) (ite (<= next0_robot_id_temp  0) (+ next0_robot_id_temp r) next0_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next1_robot_id (clock l))  (postion next0_robot_id (clock l)) )))
(ite (> gap_temp 0)
(- (- n 2) (- gap_temp 1))
(- (- n 2) (- (+ gap_temp n) 1)) 
)
)
)
3)
(= (let (
(next2_robot_id
(let ((next2_robot_id_temp  (- x 2))) (ite (<= next2_robot_id_temp  0) (+ next2_robot_id_temp r) next2_robot_id_temp))
)
(next1_robot_id
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
)
(
let ((gap_temp (- (postion next2_robot_id (clock l))  (postion next1_robot_id (clock l)) )))
(ite (> gap_temp 0)
(- (- n 2) (- gap_temp 1))
(- (- n 2) (- (+ gap_temp n) 1)) 
)
)
)
0)
)
(and
(= (postion x (clock (+ l 1)))
(let ((pos_temp_1 (+ (postion x (clock l)) 1))) 
(ite (> pos_temp_1 n) 1 pos_temp_1)
)
)
(let (
(next1_robot_id 
(let ((next1_robot_id_temp  (- x 1))) (ite (<= next1_robot_id_temp  0) (+ next1_robot_id_temp r) next1_robot_id_temp))
)
(next2_robot_id 
(let ((next2_robot_id_temp  (- x 2))) (ite (<= next2_robot_id_temp  0) (+ next2_robot_id_temp r) next2_robot_id_temp))
)
)
(and 
(= (postion next1_robot_id  (clock (+ l 1)))
(postion next1_robot_id  (clock l ))
)
(= (postion next2_robot_id  (clock (+ l 1)))
(postion next2_robot_id  (clock l ))
)
)
)
)
)
)
)
;反向规则 生成结束
;规则匹配 定义结束

;重复移动验证生成器  定义开始
(assert (or
(forall ((x Int) (y Int))
(=> (and (> x 1)
(<= x smt_upper_bound)
(> y 1)
(<= y smt_upper_bound)
(< x y)
(let
(
(move_1_r (- (postion 1 (clock y)) (postion 1 (clock x))))
(move_2_r (- (postion 2 (clock y)) (postion 2 (clock x))))
(move_3_r (- (postion 3 (clock y)) (postion 3 (clock x))))
)
(and
(= move_1_r move_2_r)
(= move_2_r move_3_r)
)
)
(forall ((z Int))
(=>  (and
(> z x)
(< z y)
)
(let
(
(move_1_r (- (postion 1 (clock y)) (postion 1 (clock x))))
(move_2_r (- (postion 2 (clock y)) (postion 2 (clock x))))
(move_3_r (- (postion 3 (clock y)) (postion 3 (clock x))))
)
(not
(and
(= move_1_r move_2_r)
(= move_2_r move_3_r)
)
)
)
)
)
)
(let
(
(move_1_r (let ((move_1 (- (postion 1 (clock y)) (postion 1 (clock x))))) (ite (< move_1 0) (+ move_1 n) move_1)))
(move_2_r (let ((move_2 (- (postion 2 (clock y)) (postion 2 (clock x))))) (ite (< move_2 0) (+ move_2 n) move_2)))
(move_3_r (let ((move_3 (- (postion 3 (clock y)) (postion 3 (clock x))))) (ite (< move_3 0) (+ move_3 n) move_3)))
)
(and
(> move_1_r 0)
(< move_1_r n)
(= move_1_r move_2_r)
(= move_2_r move_3_r)
)
)
)
)
(forall ((x Int) (y Int))
(=> (and (> x 1)
(<= x smt_upper_bound)
(> y 1)
(<= y smt_upper_bound)
(< x y)
(let
(
(move_1_r (- (postion 1 (clock y)) (postion 1 (clock x))))
(move_2_r (- (postion 2 (clock y)) (postion 2 (clock x))))
(move_3_r (- (postion 3 (clock y)) (postion 3 (clock x))))
)
(and
(= move_1_r move_2_r)
(= move_2_r move_3_r)
)
)
(forall ((z Int))
(=>  (and
(> z x)
(< z y)
)
(let
(
(move_1_r (let ((move_1 (- (postion 1 (clock y)) (postion 1 (clock x))))) (ite (< move_1 0) (+ move_1 n) move_1)))
(move_2_r (let ((move_2 (- (postion 2 (clock y)) (postion 2 (clock x))))) (ite (< move_2 0) (+ move_2 n) move_2)))
(move_3_r (let ((move_3 (- (postion 3 (clock y)) (postion 3 (clock x))))) (ite (< move_3 0) (+ move_3 n) move_3)))
)
(not
(and
(= move_1_r move_2_r)
(= move_2_r move_3_r)
)
)
)
)
)
)
(let
(
(move_1_r (let ((move_1 (- (postion 1 (clock y)) (postion 1 (clock x))))) (ite (> move_1 0) (- move_1 n) move_1)))
(move_2_r (let ((move_2 (- (postion 2 (clock y)) (postion 2 (clock x))))) (ite (> move_2 0) (- move_2 n) move_2)))
(move_3_r (let ((move_3 (- (postion 3 (clock y)) (postion 3 (clock x))))) (ite (> move_3 0) (- move_3 n) move_3)))
)
(and
(< move_1_r 0)
(> move_1_r (- 0 n))
(= move_1_r move_2_r)
(= move_2_r move_3_r)
)
)
)
)
)
)
;重复移动验证生成器  定义结束

(check-sat)
(get-value (n))
(get-value ((postion 1 (clock 1))))
(get-value ((postion 2 (clock 1))))
(get-value ((postion 3 (clock 1))))
(get-value ((postion 1 (clock 2))))
(get-value ((postion 2 (clock 2))))
(get-value ((postion 3 (clock 2))))
(get-value ((postion 1 (clock 3))))
(get-value ((postion 2 (clock 3))))
(get-value ((postion 3 (clock 3))))
(get-value ((postion 1 (clock 4))))
(get-value ((postion 2 (clock 4))))
(get-value ((postion 3 (clock 4))))
(get-value ((postion 1 (clock 5))))
(get-value ((postion 2 (clock 5))))
(get-value ((postion 3 (clock 5))))
(get-value ((postion 1 (clock 6))))
(get-value ((postion 2 (clock 6))))
(get-value ((postion 3 (clock 6))))
(get-value ((postion 1 (clock 7))))
(get-value ((postion 2 (clock 7))))
(get-value ((postion 3 (clock 7))))
(get-value ((postion 1 (clock 8))))
(get-value ((postion 2 (clock 8))))
(get-value ((postion 3 (clock 8))))
(get-value ((postion 1 (clock 9))))
(get-value ((postion 2 (clock 9))))
(get-value ((postion 3 (clock 9))))
(get-value ((postion 1 (clock 10))))
(get-value ((postion 2 (clock 10))))
(get-value ((postion 3 (clock 10))))
(get-value ((postion 1 (clock 11))))
(get-value ((postion 2 (clock 11))))
(get-value ((postion 3 (clock 11))))
(get-value ((postion 1 (clock 12))))
(get-value ((postion 2 (clock 12))))
(get-value ((postion 3 (clock 12))))
(get-value ((postion 1 (clock 13))))
(get-value ((postion 2 (clock 13))))
(get-value ((postion 3 (clock 13))))
(get-value ((postion 1 (clock 14))))
(get-value ((postion 2 (clock 14))))
(get-value ((postion 3 (clock 14))))
(get-value ((postion 1 (clock 15))))
(get-value ((postion 2 (clock 15))))
(get-value ((postion 3 (clock 15))))
(get-value ((postion 1 (clock 16))))
(get-value ((postion 2 (clock 16))))
(get-value ((postion 3 (clock 16))))
(get-value ((postion 1 (clock 17))))
(get-value ((postion 2 (clock 17))))
(get-value ((postion 3 (clock 17))))
(get-value ((postion 1 (clock 18))))
(get-value ((postion 2 (clock 18))))
(get-value ((postion 3 (clock 18))))
(get-value ((postion 1 (clock 19))))
(get-value ((postion 2 (clock 19))))
(get-value ((postion 3 (clock 19))))
(get-value ((postion 1 (clock 20))))
(get-value ((postion 2 (clock 20))))
(get-value ((postion 3 (clock 20))))
(get-model)
