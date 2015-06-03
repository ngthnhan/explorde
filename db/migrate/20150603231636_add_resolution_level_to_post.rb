class AddResolutionLevelToPost < ActiveRecord::Migration
  def up
    add_column :posts, :resolution_level, :integer
  end

  def down
  	remove_column :posts, :resolution_level
	end
end
