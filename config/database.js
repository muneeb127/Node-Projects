if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb+srv://itsmuneeb127:steam127$@cluster0-bw6ox.mongodb.net/test?retryWrites=true&w=majority'
    }
}
else{
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/vidjot-dev' 
    }
}