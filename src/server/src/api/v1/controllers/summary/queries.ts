export const GET_SUMMARY_TOKEN_COUNTS = `
select b.total_count as count, json_agg(json_build_object('text', b.text, 'count', b.count)) as rows from (
  select count(*) over() as total_count, a.text, a.count from (
    select summary_tokens.text, count(*)
    from summary_tokens
    left join summaries on summaries.id = summary_tokens."parentId"
    where "originalDate" > NOW() - interval :interval
    group by summary_tokens.text
    order by count desc
  ) a
  limit :limit
  offset :offset
) b
group by b.total_count;
`;