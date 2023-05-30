//Controller File

exports.getUserData = async (req, res, next) => {
    try {
        const userData = await Users.find();
        const statusData = ["active", "inactive", "disabled"];
        const status = [];
        for (let i = 0; i < statusData.length; i++) {
            const userData2 = await Users.find({ status: statusData[i] }).count();
            status.push(userData2)
        }
        res.status(201).json({
            "success": true,
            "message": "Date find successfully",
            "data": {
                "userData": userData,
                "status": status
            }
        })
    }
    catch (error) {
        console.log(error)
    }
}

exports.getChart = async (req, res, next) => {
    try {
        const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        const year = req.params.year;
        const chartMonthData = [];
        for (let i = 1; i <= months.length; i++) {
            const userData = await Users.find(
                {
                    $expr: {
                        $and: [
                            { $eq: [{ $substr: ["$created_at", 5, 2] }, months[i]] },
                            { $eq: [{ $substr: ["$created_at", 0, 4] }, year] },
                        ],
                    },
                }
            ).count();
            chartMonthData.push(userData)
        }
        const yearData = await Users.aggregate([
            {
                $group: {
                    _id: { $year: { $toDate: "$created_at" } }
                }
            }
        ])
        const userYearData = yearData.map(obj => {
            return obj._id;
        })
        const sortYear = userYearData.sort((a, b) => { return a - b })

        res.status(201).json({
            "success": true,
            "message": "Date find successfully",
            "data": {
                "chartMonthData": chartMonthData,
                "userYearData": sortYear
            }
        })
    }
    catch (error) {
        console.log(error)
    }
}
