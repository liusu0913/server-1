const sequelize = require('~/libs/db');
const {QueryTypes} = require('sequelize');

module.exports = {
  async visitor(ctx) {
    const {session_user} = ctx;
    const jobId = session_user.jobId;
    const belongCompany = session_user.belongCompany;
    const companyId = session_user.companyId + '%';
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().slice(0, 10);
    const total = await sequelize.query(`select count(distinct open_id) as uv
                                         from pvLog
                                         where job_id = ?
                                           and belong_company = ?
                                           and company_id like ?`,
      {
        replacements: [jobId, belongCompany, companyId],
        type: QueryTypes.SELECT
      });
    const data = {
      total: total[0].uv,
      today: 0,
      yesterday: 0
    }
    const result = await sequelize.query(`select date (updated_at) as date, count (distinct open_id) as uv
                                          from pvLog
                                          where job_id = ?
                                            and belong_company = ?
                                            and company_id like ?
                                            and (date (updated_at) = ?
                                             or date (updated_at) = ?)
                                          group by date (updated_at)`,
      {
        replacements: [jobId, belongCompany, companyId, today, yesterday],
        type: QueryTypes.SELECT
      });
    for (const v of result) {
      if (v.date === today) {
        data.today = v.uv
      } else {
        data.yesterday = v.uv
      }
    }
    return {
      code: 0,
      message: 'success',
      data: data
    }
  },

  async rank(ctx) {
    const {session_user} = ctx;
    const jobId = session_user.jobId;
    const belongCompany = session_user.belongCompany;
    const companyId = session_user.companyId + '%';
    const today = new Date().toISOString().slice(0, 10);
    // mysql5.7没有窗口函数RANK()，此处使用变量实现RANK()
    const result = await sequelize.query(`select rank
                                          from (select a.*,
                                                       @rowNumber := @rowNumber + 1, @rank := if(@curUV = a.uv,
                                          @rank, @rowNumber) as rank, @curUV := a.uv
                                                from
                                                    (select job_id, count (distinct open_id) as uv
                                                    from pvLog
                                                    where belong_company = ?
                                                    and company_id like ?
                                                    and date (updated_at) = ?
                                                    group by job_id
                                                    order by uv desc) a,
                                                    (select @rank := 0, @rowNumber := 0, @curUV := null) r) b
                                          where job_id = ?`,
      {
        replacements: [belongCompany, companyId, today, jobId],
        type: QueryTypes.SELECT
      });
    const data = {rank: result.length === 0 ? 0 : parseInt(result[0].rank)}
    return {
      code: 0,
      message: 'success',
      data: data
    }
  }
}
