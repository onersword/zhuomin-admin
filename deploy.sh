pnpm build

tar zcvf admin-zhuomin.tar.gz ./dist
scp -r ./admin-zhuomin.tar.gz zhuomin:~


echo "---------------进入服务器执行-----------------------"
ssh zhuomin << remotessh
mv ./admin-zhuomin.tar.gz /var/www/
cd /var/www/
tar xvf admin-zhuomin.tar.gz
rm -rf ./admin-zhuomin/*
mv ./dist/* ./admin-zhuomin/
rm -rf ./dist
rm -rf admin-zhuomin.tar.gz

exit
remotessh

echo "---------------执行完毕-----------------------"
