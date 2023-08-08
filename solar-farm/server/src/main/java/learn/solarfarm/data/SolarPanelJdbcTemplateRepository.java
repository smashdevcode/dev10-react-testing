package learn.solarfarm.data;

import learn.solarfarm.models.Material;
import learn.solarfarm.models.SolarPanel;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class SolarPanelJdbcTemplateRepository implements SolarPanelRepository {
    private final JdbcTemplate jdbcTemplate;

    public SolarPanelJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SolarPanel> mapper = (resultSet, rowIndex) -> {
        SolarPanel solarPanel = new SolarPanel();

        solarPanel.setId(resultSet.getInt("id"));
        solarPanel.setSection(resultSet.getString("section"));
        solarPanel.setRow(resultSet.getInt("row"));
        solarPanel.setColumn(resultSet.getInt("column"));
        solarPanel.setYearInstalled(resultSet.getInt("year_installed"));

        Material material = Material.valueOf(resultSet.getString("material"));
        solarPanel.setMaterial(material);

        solarPanel.setTracking(resultSet.getBoolean("is_tracking"));

        return solarPanel;
    };

    @Override
    public List<SolarPanel> findAll() throws DataAccessException {

        final String sql = "select id, section, `row`, `column`, year_installed, material, is_tracking " +
                "from solar_panel " +
                "order by section, `row`, `column`;";

        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public List<SolarPanel> findBySection(String section) throws DataAccessException {

        // SQL injection
        // '; drop table solar_panel;

//        final String sql = String.format("select id, section, `row`, `column`, year_installed, material, is_tracking " +
//                "from solar_panel " +
//                "where section = '%s' " +
//                "order by section, `row`, `column`;", section);

        final String sql = "select id, section, `row`, `column`, year_installed, material, is_tracking " +
                "from solar_panel " +
                "where section = ? " +
                "order by section, `row`, `column`;";

        return jdbcTemplate.query(sql, mapper, section);
    }

    @Override
    public SolarPanel findById(int id) throws DataAccessException {
        final String sql = "select id, section, `row`, `column`, year_installed, material, is_tracking " +
                "from solar_panel " +
                "where id = ?";

//        try {
//            return jdbcTemplate.queryForObject(sql, mapper, id);
//        } catch (EmptyResultDataAccessException ex) {
//            return null;
//        }

        // This approach avoids the exception from being thrown.
        return jdbcTemplate.query(sql, mapper, id).stream().findFirst().orElse(null);
    }

    @Override
    public SolarPanel create(SolarPanel solarPanel) throws DataAccessException {

        final String sql = "insert into solar_panel (section, `row`, `column`, year_installed, material, is_tracking) " +
                "values (?, ?, ?, ?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, solarPanel.getSection());
            statement.setInt(2, solarPanel.getRow());
            statement.setInt(3, solarPanel.getColumn());
            statement.setInt(4, solarPanel.getYearInstalled());
            statement.setString(5, solarPanel.getMaterial().toString());
            statement.setBoolean(6, solarPanel.isTracking());
            return statement;
        }, keyHolder);

        if (rowsAffected == 0) {
            return null;
        }

        solarPanel.setId(keyHolder.getKey().intValue());

        return solarPanel;
    }

    @Override
    public boolean update(SolarPanel solarPanel) throws DataAccessException {
        final String sql = "update solar_panel set " +
                "section = ?, " +
                "`row` = ?, " +
                "`column` = ?, " +
                "year_installed = ?, " +
                "material = ?, " +
                "is_tracking = ? " +
                "where id = ?;";

        int rowsUpdated = jdbcTemplate.update(sql,
                solarPanel.getSection(),
                solarPanel.getRow(),
                solarPanel.getColumn(),
                solarPanel.getYearInstalled(),
                solarPanel.getMaterial().toString(),
                solarPanel.isTracking(),
                solarPanel.getId());

        return rowsUpdated > 0;
    }

    @Override
    public boolean deleteById(int id) throws DataAccessException {
        final String sql = "delete from solar_panel where id = ?;";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
