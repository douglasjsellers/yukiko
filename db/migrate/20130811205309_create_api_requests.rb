class CreateApiRequests < ActiveRecord::Migration
  def change
    create_table :api_requests do |t|
      t.text 'request'
      t.timestamps
    end
  end
end
