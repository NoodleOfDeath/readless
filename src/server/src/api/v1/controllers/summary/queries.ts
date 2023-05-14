export const GET_SUMMARY_TOKEN_COUNTS = `
select 
  b.total_count as count, 
  json_agg(
    json_build_object(
      'text', b.text, 
      'type', b.type, 
      'count', b.count
    )
  ) as rows from (
    select count(*) over() as total_count, a.text, a.type, a.count from (
      select
       summary_tokens.text, 
       summary_tokens.type, 
       count(summary_tokens.text) as count
      from summary_tokens
      left join summaries on summaries.id = summary_tokens."parentId"
      where 
        summary_tokens."deletedAt" is null
        and summaries."deletedAt" is null
        and "originalDate" > NOW() - interval :interval
        and type LIKE :type
      group by 
        summary_tokens.text, 
        summary_tokens.type
      having count(summary_tokens.text) >= :min
      order by count desc
    ) a
    limit :limit
    offset :offset
  ) b
group by b.total_count;
`;
