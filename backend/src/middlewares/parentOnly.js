function parentOnly(req,res,next) {
    try{
        if(!req.user || req.user.role !== 'parent') {
            return res.status(403).json({ message:'この操作は親のアカウントでしか実行できません！' })
        }
        next();
    }catch (error) {
        next(error);
    }
}

module.exports = parentOnly;