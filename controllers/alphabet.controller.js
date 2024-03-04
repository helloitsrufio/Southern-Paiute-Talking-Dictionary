module.exports = {
//Alphabet Page app.get('/alphabet'), 
    alphabet: async (req,res)=>{
        try {
            res.render('alphabetPage.ejs')
        }catch (err) {
            console.error(err);}
    }
}
