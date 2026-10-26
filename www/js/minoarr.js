
//表示されているテトリミノ管理用の配列を宣言する　
var mino_arry = new Array();

//##################################
//配列の初期化　newGame関数内で呼ぶ
//##################################
function initMinoArry(){
//mino_arry.lengh = 0;
    while(mino_arry.pop());

}
//##################################
//テトリミノを登録　newShape関数内で呼ぶ
//##################################
function setNewMino(no){
mino_arry.push(no);
}
//#######################
//テトリミノ削除 deletecheck関数内で　deleteflgがtrueになったとき呼ぶ
//#######################
function deleteMino(no){
//配列をnoで検索する
//alert(no);
//var index = mino_arry.indexOf(no);
var index = -1;
for (var i=0,l=mino_arry.length; i<l; i++) {
		if (mino_arry[i] === no){
		    index = i;
			break;
		}
}    
if(index != -1){//-1にならないはずだが念のため
//mino_arry[index] = 0;//clear
//    alert(index);
    mino_arry.splice(index,1);
}

}
